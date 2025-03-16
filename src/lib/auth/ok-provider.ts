import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import * as CryptoJS from "crypto-js";

export default function OKProvider<P extends Record<string, any> = any>(
	options: OAuthUserConfig<P>,
): OAuthConfig<P> {
	const apiVersion = "5.131"; // https://vk.com/dev/versions

	return {
		id: "ok",
		name: "OK",
		type: "oauth",
		authorization: `https://connect.ok.ru/oauth/authorize?scope=GET_EMAIL;VALUABLE_ACCESS`,
		client: {
			token_endpoint_auth_method: "client_secret_post",
		},
		token: `https://api.ok.ru/oauth/token.do?grant_type=authorization_code`,
		userinfo: {
			url: `https://api.ok.ru/fb.do?users.getCurrentUser`,
			async request({ tokens, provider }: any) {
				console.log(tokens, provider);

				const accessSecret = CryptoJS.MD5(
					tokens.access_token + provider.clientSecret,
				).toString();
				const sign = CryptoJS.MD5(
					`application_key=${provider.clientPublic}format=jsonmethod=users.getCurrentUser${accessSecret}`,
				).toString();

				const loggedInUserId = await fetch(
					`${provider.userinfo?.url}&application_key=${provider.clientPublic}&format=json&method=users.getCurrentUser&access_token=${tokens.access_token}&sig=${sign}`,
					{},
				).then(async (res) => await res.json());
				console.log(loggedInUserId);
				return {
					id: loggedInUserId.uid,
					email: loggedInUserId.email ?? loggedInUserId.id,
					first_name: loggedInUserId.first_name,
					last_name: loggedInUserId.last_name,
					photo_100: loggedInUserId.pic_3,
				};
			},
		},
		profile(profile: P) {
			console.log(profile);
			return {
				id: profile.id,
				name: [profile.first_name, profile.last_name]
					.filter(Boolean)
					.join(" "),
				email: profile.email ?? null,
				image: profile.photo_100,
			};
		},
		style: { bg: "#07F", text: "#fff", logo: "" },
		options,
	};
}
