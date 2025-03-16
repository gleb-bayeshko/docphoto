import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Bucket, getPresignedUrl } from "~/lib/s3";
import { nanoid } from "nanoid";
import mime from "mime-types";
import { createArticleInputSchema } from "../schemas/articles";
import slugify from "@sindresorhus/slugify";

export const articlesRouter = createTRPCRouter({
  getArticleById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: {
          id: input.id,
        },
      });
      return article;
    }),
  getArticleBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.db.article.findUnique({
        where: {
          slug: input.slug,
        },
      });
      return article;
    }),
  getArticles: publicProcedure
    .input(z.object({ cursor: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const page = input.cursor ?? 0;
      const total = await ctx.db.article.count();
      const articles = await ctx.db.article.findMany({
        take: 10,
        where: {
          slug: {
            not: "rules",
          },
        },
        skip: input.cursor ? input.cursor * 10 : 0,
        orderBy: {
          updatedAt: "desc",
        },
      });
      const hasMore = total > page * 10 + articles.length;
      return { articles, nextPage: hasMore ? page + 1 : undefined, total };
    }),
  deleteArticle: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.delete({
        where: {
          id: input.id,
        },
      });
      return article;
    }),
  editArticle: adminProtectedProcedure
    .input(z.object({ id: z.string(), input: createArticleInputSchema }))
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.update({
        where: {
          id: input.id,
        },
        
        data: {
          title: input.input.title,
          contentJson: input.input.contentJson,
          description: input.input.description,
          slug:
            input.input.title !== "rules_page"
              ? slugify(input.input.title + "-" + new Date().getTime() / 1000)
              : "rules",
        },
      });
      return article;
    }),
  createArticle: adminProtectedProcedure
    .input(createArticleInputSchema)
    .mutation(async ({ input, ctx }) => {
      const article = await ctx.db.article.create({
        data: {
          title: input.title,
          contentJson: input.contentJson,
          description: input.description,
          slug: slugify(input.title + "-" + new Date().getTime() / 1000),
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return article;
    }),
});
