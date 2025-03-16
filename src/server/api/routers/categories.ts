import { z } from "zod";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createCategoryInputSchema } from "../schemas/categories";

export const categoriesRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createCategoryInputSchema)
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.db.category.create({
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
      return category;
    }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: {
          slug: input.slug,
        },
      });
      return category;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany();
    return categories.filter(
      (x) => x.slug !== "reportage" && !x.name.includes("reportage"),
    );
  }),
});
