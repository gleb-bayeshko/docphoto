import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Bucket } from "~/lib/s3";
import { nanoid } from "nanoid";

export const equipmentRouter = createTRPCRouter({
  createCamera: protectedProcedure
    .input(z.object({ make: z.string(), model: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const camera = await ctx.db.camera.create({
        data: {
          make: input.make,
          model: input.model,
        },
      });
      return camera;
    }),
    searchCameras: protectedProcedure
    .input(z.object({ search: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const cameras = await ctx.db.camera.findMany({
        where: {
          AND: [
            {
              make: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              model: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        },
      });
      return cameras;
    }),

});
