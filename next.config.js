/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");




/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    typescript: {
        ignoreBuildErrors: true,
      },
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                hostname: 's3.roxxel.me'
            },
            {
                hostname: 's3.timeweb.cloud'
            },
            {
                hostname: 'cdn.docphoto.pro'
            }
        ]
    }
};

export default config;
