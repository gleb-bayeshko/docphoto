import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Bucket, getPresignedUrl } from "~/lib/s3";
import { nanoid } from "nanoid";
import mime from "mime-types";

export const uploadsRouter = createTRPCRouter({
  createPresignedUrls: protectedProcedure
    .input(z.object({ contentType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await getPresignedUrl(input.contentType, true);
    }),
});
