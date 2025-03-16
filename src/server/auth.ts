import { PrismaAdapter } from "@auth/prisma-adapter";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import VkProvider from "next-auth/providers/vk";
import { env } from "~/env";
import { db } from "~/server/db";
import { compare, hash } from "bcrypt";
import { addDays, addHours } from "date-fns";
import { sendVerificationCode } from "~/lib/mail";
import {
	AuthDataValidator,
	objectToAuthDataMap,
	TelegramUserData,
} from "@telegram-auth/server";
import VKIDProvider from "~/lib/auth/vk-id-provider";
import OKProvider from "~/lib/auth/ok-provider";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

const nextAuthError = (err: string) => {
	return { error: err } as unknown as {
		id: string;
		email: string;
		name: string;
	};
};

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		jwt: async ({ token, user, profile }) => {
			if (user) {
				token.id = user.id;
				token.picture = user.image;
			}

			return token;
		},
		session: ({ session, token }) => {
			const s = {
				...session,
				user: {
					...session.user,
					id: token.id,
					image: token.picture,
				},
			};
			return s;
		},
		async signIn({ user, account, profile, email, credentials }) {
			if ("error" in user) {
				throw new Error(user.error as string);
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
		},
	},
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		VkProvider({
			clientId: env.VK_CLIENT_ID,
			clientSecret: env.VK_CLIENT_SECRET,
			profile(profile, tokens) {
				tokens.userId = tokens.user_id as number;
				const email = tokens.email as string;
				delete tokens.user_id;
				delete tokens.email;
				const prof = profile.response[0];
				return {
					id: prof.id,
					username: prof.id.toString(),
					name: [prof.first_name, prof.last_name]
						.filter(Boolean)
						.join(" "),
					email: prof.id.toString(),
					avatarUrl: null,
				};
			},
		}),
		OKProvider({
			clientId: env.OK_CLIENT_ID,
			clientSecret: env.OK_CLIENT_SECRET,
			//@ts-expect-error We need this
			clientPublic: env.OK_CLIENT_PUBLIC,
			profile(profile, tokens) {
				console.log(profile, tokens);
				tokens.userId = profile.id as string;
				const prof = profile;
				return {
					id: prof.id,
					username: prof.id,
					name: [prof.first_name, prof.last_name]
						.filter(Boolean)
						.join(" "),
					email: prof.id.toString(),
					avatarUrl: null,
				};
			},
		}),
		CredentialsProvider({
			id: "telegram-login",
			name: "Telegram Login",
			credentials: {},
			async authorize(credentials, req) {
				const validator = new AuthDataValidator({
					botToken: `${env.TELEGRAM_BOT_TOKEN}`,
				});

				const data = objectToAuthDataMap(req.query || {});
				const user = await validator.validate(data);

				if (user.id && user.first_name) {
					try {
						const userDb = await createUserOrUpdate(user);
						return {
							id: userDb.id,
							email: userDb.email,
							name: userDb.username,
						};
					} catch {
						console.log(
							"Something went wrong while creating the user.",
						);
					}
				}
				return null;
			},
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials, req) {
				if (!credentials) {
					return null;
				}
				const user = await db.user.findFirst({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					return nextAuthError("Пользователь не найден");
				}

				if (!user.emailVerified) {
					try {
						await sendVerificationCode({ email: user.email! });
					} catch (e) {}
					return nextAuthError(
						"Нужно подтвердить почту. Проверьте почту и перейдите по ссылке в письме.",
					);
				}
				if (user.isBanned) {
					return nextAuthError(
						`Ваш аккаунт заблокирован: ${user.reasonForBan}`,
					);
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
				const isValid = await compare(
					credentials.password,
					user.hashedPassword!,
				);

				if (!isValid) {
					return nextAuthError("Неверный пароль");
				}
				return {
					id: user.id,
					email: user.email,
					name: user.username,
				};
			},
		}),
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
function createUserOrUpdate(user: TelegramUserData) {
	let username = user.username;
	if (!username) {
		username = user.first_name.replace(/![a-zA-Z]/g, "");
		if (username.length < 3) {
			username = user.id.toString();
		}
	}
	return db.user.upsert({
		where: {
			id: user.id.toString(),
		},
		create: {
			id: user.id.toString(),
			name: [user.first_name, user.last_name || ""].join(" "),
			email: user.id.toString(),
			username: user.id.toString(),
		},
		update: {},
	});
}
