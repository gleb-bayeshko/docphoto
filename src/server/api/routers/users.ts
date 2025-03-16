import { z } from "zod";

import {
	adminProtectedProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import {
	createCameraInputSchema,
	createLensInputSchema,
	updateProfileInputSchema,
} from "../schemas/users";
import { copyFile, getObjectStat, removeObject } from "~/lib/s3";
import { TRPCError } from "@trpc/server";
import mime from "mime-types";
import { set } from "date-fns";
import { revalidatePath } from "next/cache";

export const usersRouter = createTRPCRouter({
	getUserProfileByUsername: publicProcedure
		.input(z.object({ username: z.string() }))
		.query(async ({ input, ctx }) => {
			const user = await ctx.db.user.findUnique({
				where: {
					username: input.username,
				},
				select: {
					id: true,
					username: true,
					name: true,
					isBanned: true,
					avatarUrl: true,
					biography: true,
					siteRole: true,
					occupation: true,
					favoriteCategoryId: true,
					favoriteCameraId: true,
				},
			});
			if (!user) {
				return null;
			}
			const favoriteCamera = await ctx.db.camera.findFirst({
				where: {
					id: user.favoriteCameraId ?? "0",
				},
			});
			const favoriteCategory = await ctx.db.category.findFirst({
				where: {
					id: user.favoriteCategoryId ?? "0",
				},
				select: {
					name: true,
					slug: true,
				},
			});
			//get user's last post
			const lastPost = await ctx.db.post.findFirst({
				where: {
					userId: user?.id,
					AND: {
						report: null,
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				select: {
					imageUrl: true,
					width: true,
					height: true,
					id: true,
					name: true,
					slug: true,
					createdAt: true,
				},
			});
			return { ...user, lastPost, favoriteCamera, favoriteCategory };
		}),

	getEquipment: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
			include: {
				cameras: true,
				lenses: true,
			},
		});

		return {
			cameras: user?.cameras ?? [],
			lenses: user?.lenses ?? [],
		};
	}),
	setFavoriteCamera: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const camera = await ctx.db.camera.findUnique({
				where: {
					id: input.id,
				},
			});
			if (!camera) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Камера не найдена",
				});
			}
			if (camera.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Нет доступа",
				});
			}
			const user = await ctx.db.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					favoriteCameraId: input.id,
				},
			});

			return { make: camera.make, model: camera.model };
		}),
	createCamera: protectedProcedure
		.input(createCameraInputSchema)
		.mutation(async ({ input, ctx }) => {
			const camera = await ctx.db.camera.create({
				data: {
					make: input.make,
					model: input.model,
					type: input.type,
					user: {
						connect: {
							id: ctx.session.user.id,
						},
					},
				},
			});

			return camera;
		}),
	createLens: protectedProcedure
		.input(createLensInputSchema)
		.mutation(async ({ input, ctx }) => {
			const lens = await ctx.db.lens.create({
				data: {
					make: input.make,
					model: input.model,
					user: {
						connect: {
							id: ctx.session.user.id,
						},
					},
				},
			});

			return lens;
		}),
	removeLens: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const lens = await ctx.db.lens.findUnique({
				where: {
					id: input.id,
				},
				include: { user: true },
			});
			if (!lens) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Объектив не найден",
				});
			}
			if (lens.user.id !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Нет доступа",
				});
			}
			await ctx.db.lens.delete({
				where: {
					id: input.id,
				},
			});

			return lens;
		}),
	removeCamera: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const camera = await ctx.db.camera.findUnique({
				where: {
					id: input.id,
				},
				include: { user: true },
			});
			if (!camera) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Камера не найдена",
				});
			}
			if (camera.user.id !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Нет доступа",
				});
			}
			await ctx.db.camera.delete({
				where: {
					id: input.id,
				},
			});

			return camera;
		}),
	updateAvatar: protectedProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ input, ctx }) => {
			let user = await ctx.db.user.findUnique({
				where: {
					id: ctx.session.user.id,
				},
			});
			const stat = await getObjectStat(input.key);
			if (!stat?.Metadata?.["content-type"]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Файл не найден",
				});
			}
			const ext = mime.extension(stat.Metadata["content-type"]);
			if (!["png", "jpg", "jpeg"].includes(ext || "")) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Неверный формат файла",
				});
			}
			const avatar = await copyFile(
				input.key,
				ext || "",
				"avatars",
				1024 * 1024,
			);
			if (user?.avatarUrl) {
				const key = user.avatarUrl.split("/").pop()!;
				await removeObject(
					"public/avatars/" + user.avatarUrl.split("/").pop()!,
				);
			}
			user = await ctx.db.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					avatarUrl: avatar.url,
				},
			});

			return user;
		}),

	updateProfile: protectedProcedure
		.input(updateProfileInputSchema)
		.mutation(async ({ input, ctx }) => {
			let username: string | undefined = undefined;
			if (input.username) {
				username = input.username.trim().toLowerCase();
				const existingUsername = await ctx.db.user.findFirst({
					where: {
						username,
						AND: [{ id: { not: ctx.session.user.id } }],
					},
				});
				if (existingUsername) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "Имя пользователя уже занято",
					});
				}
			}
			const user = await ctx.db.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					...(input.name === ";;;ignore;;;"
						? {}
						: { name: input.name }),
					username: username,
					favoriteCategoryId: input.favoriteCategoryId,
					biography: input.biography,
					occupation: input.occupation,
					siteRole: input.role,
				},
			});
			revalidatePath("/", "layout");
			return user;
		}),

	banUser: adminProtectedProcedure
		.input(z.object({ id: z.string(), reason: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (ctx.session.user.id === input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Нельзя забанить самого себя",
				});
			}
			const user = await ctx.db.user.update({
				where: {
					id: input.id,
				},
				data: {
					isBanned: true,
					reasonForBan: input.reason,
				},
			});

			return user;
		}),

	getUsersCreatedAfter: adminProtectedProcedure
		.input(z.object({ date: z.coerce.date() }))
		.query(async ({ input, ctx }) => {
			const users = await ctx.db.user.findMany({
				where: {
					createdAt: {
						gte: input.date,
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				select: {
					id: true,
					username: true,
					name: true,
					email: true,
					emailVerified: true,
					isBanned: true,
					reasonForBan: true,
					createdAt: true,
					siteRole: true,
				},
			});

			return users;
		}),

	unbanUser: adminProtectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.db.user.update({
				where: {
					id: input.id,
				},
				data: {
					isBanned: false,
					reasonForBan: null,
				},
			});

			return user;
		}),
});
