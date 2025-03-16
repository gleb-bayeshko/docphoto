import { OutputData } from "@editorjs/editorjs";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { env } from "~/env";

export const metaType = z.array(
  z.object({
    key: z.string(),
    value: z.string(),
    displayName: z.string(),
  }),
);
function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d?.getTime());
}
const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    result: {
      article: {
        content: {
          needs: { contentJson: true },
          compute(obj) {
            const json = obj?.contentJson;
            if (!json) {
              return null;
            }
            try {
              return JSON.parse(json) as OutputData;
            } catch {
              return null;
            }
          },
        },
      },
      post: {
        metadata: {
          needs: { meta: true },
          compute(metaObj) {
            const meta = metaObj?.meta;
            if (!meta) {
              return [];
            }
            try {
              const json = JSON.parse(meta);
              const metadata = metaType.parse(json);
              const parsed = metadata.map((meta) => {
                // const date = new Date(meta.value);
                // if (isValidDate(date)) {
                //   return { ...meta, value: date };
                // }
                return meta;
              });
              return metadata;
            } catch {
              return [];
            }
          },
        },
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
