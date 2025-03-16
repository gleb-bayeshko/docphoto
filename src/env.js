import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		S3_SECRET_KEY: z.string(),
		S3_ACCESS_KEY: z.string(),
		TELEGRAM_BOT_TOKEN: z.string(),
		S3_SERVER_URL: z.string().url(),
		S3_PUBLIC_URL: z.string().url(),
		CRON_API_KEY: z.string(),
		EMAIL_PASSWORD: z.string(),
		VK_CLIENT_ID: z.string(),
		VK_CLIENT_SECRET: z.string(),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		OK_CLIENT_ID: z.string(),
		OK_CLIENT_SECRET: z.string(),
		OK_CLIENT_PUBLIC: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
		S3_SERVER_URL: process.env.S3_SERVER_URL,
		S3_SECRET_KEY: process.env.S3_SECRET_KEY,
		S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
		S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		CRON_API_KEY: process.env.CRON_API_KEY,
		VK_CLIENT_ID: process.env.VK_CLIENT_ID,
		VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
		OK_CLIENT_ID: process.env.OK_CLIENT_ID,
		OK_CLIENT_SECRET: process.env.OK_CLIENT_SECRET,
		OK_CLIENT_PUBLIC: process.env.OK_CLIENT_PUBLIC,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
