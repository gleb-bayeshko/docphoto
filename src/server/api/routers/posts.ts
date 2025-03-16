import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createCommentInputSchema,
  createContentInputSchema,
  createReportageInputSchema,
  updateContentInputSchema,
  updateReportageInputSchema,
} from "../schemas/posts";
import { copyFile, downloadFile, getObjectStat } from "~/lib/s3";
import slugify from "@sindresorhus/slugify";
import { TRPCError } from "@trpc/server";
import exifr from "exifr";
import mime from "mime-types";
import { metaType } from "~/server/db";
import sizeOf from "buffer-image-size";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
dayjs.locale({
  ...ru,
  weekStart: 1,
});
import utc from "dayjs/plugin/utc";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { isAdminUseCase } from "~/app/use-cases/admin";
dayjs.extend(utc);

export const postsRouter = createTRPCRouter({
  parseExif: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const stat = await getObjectStat(input.key);
      console.log(stat);
      if (!stat?.Metadata?.["content-type"]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Файл не найден",
        });
      }
      const buffer = await downloadFile(input.key);
      const exif = await exifr.parse(buffer);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return exif || {};
    }),

  createReportage: protectedProcedure
    .input(createReportageInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { imageKeys, title: name, description } = input;
      const category = await ctx.db.category.findUnique({
        where: {
          slug: "reportage",
        },
      });
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Категория не найдена",
        });
      }
      let imageUrls: {
        key: string;
        url: string;
        width: number;
        height: number;
      }[] = [];
      for await (const imageKey of imageKeys) {
        const image = await copyFile(
          imageKey,
          "jpeg",
          "reportages",
          5 * 1024 * 1024,
        );
        const imageUrl = image.url;
        const buffer = await downloadFile(image.key);
        const size = sizeOf(buffer);
        const { width, height } = size;
        imageUrls.push({ url: imageUrl, key: image.key, width, height });
      }

      const slug = slugify(`${name}-${new Date().getTime() / 1000}`, {
        decamelize: false,
      });
      const reportage = await ctx.db.report.create({
        data: {
          title: name,
          description,
          slug,
        },
      });
      for (const imageUrl of imageUrls) {
        await ctx.db.post.create({
          data: {
            description,
            name,
            views: 0,
            imageUrl: imageUrl.url,
            slug: nanoid(32),
            width: imageUrl.width,
            height: imageUrl.height,
            category: {
              connect: {
                id: category.id,
              },
            },
            author: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            report: {
              connect: {
                id: reportage.id,
              },
            },
          },
        });
      }
      revalidatePath("/reportage", "layout");
      return reportage;
    }),

  updateContent: protectedProcedure
    .input(z.object({ postId: z.string(), input: updateContentInputSchema }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          category: {
            select: {
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пост не найден",
        });
      }
      if (post.category.slug === "reportage") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Репортажи нельзя редактировать",
        });
      }
      if (post.author.id !== ctx.session.user.id) {
        const isAdmin = await isAdminUseCase();
        if (!isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "У вас нет прав на редактирование этого поста",
          });
        }
      }
      await ctx.db.post.update({
        where: {
          id: input.postId,
        },
        data: {
          ...input.input,
        },
      });
      revalidatePath("/category/");
      revalidatePath("/category/" + post.category.slug);
      return true;
    }),

  create: protectedProcedure
    .input(createContentInputSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        imageKey,
        title: name,
        createDate,
        iso,
        categoryId,
        albumId,
        camera,
        focusLength,
        aperture,
        exposureTime,
        ...content
      } = input;
      const category = await ctx.db.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Категория не найдена",
        });
      }

      const image = await copyFile(imageKey, "jpeg", "posts", 5 * 1024 * 1024);
      const imageUrl = image.url;
      const buffer = await downloadFile(image.key);
      const size = sizeOf(buffer);
      const { width, height } = size;
      const slug = slugify(
        `${name}-${category.slug}-${new Date().getTime() / 1000}`,
        {
          decamelize: false,
        },
      );
      const meta = [
        { key: "iso", value: iso?.toString(), displayName: "ISO" },
        { key: "camera", value: camera, displayName: "Камера" },
        {
          key: "aperture",
          value: aperture?.toString(),
          displayName: "Диафрагма",
        },
        {
          key: "shutterSpeed",
          value: exposureTime?.toString(),
          displayName: "Выдержка",
        },
        {
          key: "focalLength",
          value: focusLength?.toString(),
          displayName: "Фокусное расстояние",
        },
        {
          key: "createDate",
          value: createDate?.toUTCString(),
          displayName: "Дата съемки",
        },
      ].filter((item) => item.value !== undefined) as z.infer<typeof metaType>;
      const post = await ctx.db.post.create({
        data: {
          ...content,
          name,
          views: 0,
          imageUrl,
          slug,
          width,
          height,
          meta: JSON.stringify(meta),
          category: {
            connect: {
              id: categoryId,
            },
          },
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      revalidatePath(`/category/${category.slug}`, "layout");
      return post;
    }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пост не найден",
        });
      }
      const like = await ctx.db.postLike.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      let isLiked = false;
      if (like) {
        await ctx.db.postLike.delete({
          where: {
            id: like.id,
          },
        });
        isLiked = false;
      } else {
        await ctx.db.postLike.create({
          data: {
            post: {
              connect: {
                id: input.postId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        isLiked = true;
      }
      const likes = await ctx.db.postLike.count({
        where: {
          postId: input.postId,
        },
      });
      return { likes, isLiked };
    }),

  getBestBy: publicProcedure
    .input(
      z.object({
        type: z.union([
          z.literal("likes"),
          z.literal("views"),
          z.literal("comments"),
        ]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          report: null,
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          height: true,
          width: true,
          createdAt: true,
          slug: true,
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy:
          input.type === "likes"
            ? {
                likes: {
                  _count: "desc",
                },
              }
            : input.type === "comments"
              ? {
                  comments: {
                    _count: "desc",
                  },
                }
              : {
                  views: "desc",
                },
        take: 50,
      });
      return posts;
    }),
  getReportage: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const reportage = await ctx.db.report.findFirst({
        where: {
          slug: input.slug,
        },
        include: {
          post: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              id: true,
              name: true,
              imageUrl: true,
              slug: true,
              height: true,
              width: true,
              description: true,
              createdAt: true,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
      });
      if (!reportage) {
        return null;
      }
      const isAdmin = await isAdminUseCase();
      return {
        ...reportage,
        isOwner:
          ctx.session?.user.id === reportage?.post[0]?.author.id || isAdmin,
      };
    }),

  // updateReportage: protectedProcedure
  // .input(z.object({ id: z.string(), input: updateReportageInputSchema }))
  // .mutation(async ({ input, ctx }) => {
  //     const reportage = await ctx.db.report.findUnique({
  //         where: {
  //         id: input.id,
  //             AND: {
  //                 post: {
  //                     some: {
  //                         author: {
  //                             id: ctx.session.user.id
  //                         }
  //                     },
  //                 }
  //             }
  //         },
  //         include: {
  //         post: {
  //             select: {
  //             id: true,
  //             }
  //         }
  //         }
  //     });
  //     if (!reportage) {
  //         throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "Репортаж не найден",
  //         });
  //     }
  //     const post = await ctx.db.post.findUnique({
  //         where: {
  //         id: reportage.post[0].id
  //         }
  //     });

  removeReportage: protectedProcedure
    .input(z.object({ reportageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const reportage = await ctx.db.report.findUnique({
        where: {
          id: input.reportageId,
        },
        include: {
          post: {
            select: {
              id: true,
              author: {
                select: {
                  id: true,
                },
              },
              category: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });
      if (!reportage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Репортаж не найден",
        });
      }
      if (reportage.post[0]?.category.slug !== "reportage") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Репортаж не найден",
        });
      }
      if (reportage.post[0]?.author.id !== ctx.session.user.id) {
        const isAdmin = await isAdminUseCase();
        if (!isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "У вас нет прав на удаление этого репортажа",
          });
        }
      }
      for await (const post of reportage.post) {
        await ctx.db.post.delete({
          where: {
            id: post.id,
          },
        });
      }
      await ctx.db.report.delete({
        where: {
          id: input.reportageId,
        },
      });
      revalidatePath("/reportage", "layout");
      return true;
    }),

  getTop: publicProcedure
    .input(
      z.object({
        day: z.date().optional(),
        limit: z.number().gte(1).lte(50).default(50),
        type: z.union([
          z.literal("day"),
          z.literal("week"),
          z.literal("month"),
          z.literal("newest"),
        ]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const day = input.day ?? new Date();
      const type = input.type;
      if (type === "newest") {
        const posts = await ctx.db.post.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            report: null,
          },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            slug: true,
            height: true,
            width: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          take: input.limit,
        });
        return posts;
      }
      const topPosts = await ctx.db.topPost.findMany({
        where: {
          type: type,
        },
        take: 100,
        include: {
          post: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              height: true,
              width: true,
              createdAt: true,
              slug: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
      });
      return topPosts.map((x) => x.post);
    }),

  removePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          category: {
            select: {
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пост не найден",
        });
      }
      if (post.author.id !== ctx.session.user.id) {
        const isAdmin = await isAdminUseCase();
        if (!isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "У вас нет прав на удаление этого поста",
          });
        }
      }
      await ctx.db.post.delete({
        where: {
          id: input.postId,
        },
      });
      revalidatePath("/category/");
      revalidatePath("/category/" + post.category.slug);
      return true;
    }),

  getTopPostsByType: publicProcedure
    .input(
      z.object({
        type: z.union([
          z.literal("month"),
          z.literal("week"),
          z.literal("day"),
        ]),
        cursor: z.number().optional(),
        limit: z.number().gte(1).lte(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const page = input.cursor ?? 0;
      const type = input.type;
      const limit = input.limit;
      const posts = await ctx.db.topPost.findMany({
        where: {
          type,
        },
        include: {
          post: {
            include: {
              _count: {
                select: {
                  likes: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: page * limit,
        take: limit,
      });
      return posts;
    }),

  getAuthorPostsByUsername: publicProcedure
    .input(z.object({ username: z.string(), cursor: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ?? 0;
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователь не найден",
        });
      }
      const total = await ctx.db.post.count({
        where: {
          userId: user.id,
          AND: {
            report: null,
          },
        },
      });
      const posts = await ctx.db.post.findMany({
        where: {
          userId: user.id,
          AND: {
            report: null,
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: cursor * 20,
        take: 20,
      });
      const hasMore = cursor + 20 < total;
      const nextPage = hasMore ? cursor + 1 : null;
      return { posts, hasMore, total, nextPage };
    }),
  getComments: publicProcedure
    .input(z.object({ postId: z.string(), cursor: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ?? 0;
      const total = await ctx.db.comment.count({
        where: {
          postId: input.postId,
        },
      });
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: cursor * 20,
        take: 20,
      });

      const hasMore = cursor + 20 < total;
      const nextPage = hasMore ? cursor + 1 : null;
      const isAdmin = await isAdminUseCase();
      return {
        comments: comments.map((x) => ({
          ...x,
          isOwner: isAdmin || ctx.session?.user?.id === x.author.id,
        })),
        hasMore,
        total,
        nextPage,
      };
    }),

  createComment: protectedProcedure
    .input(createCommentInputSchema)
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пост не найден",
        });
      }
      const comment = await ctx.db.comment.create({
        data: {
          comment: input.text,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      });
      const createdComment = await ctx.db.comment.findUnique({
        where: {
          id: comment.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });
      return createdComment!;
    }),

  getNextAndPreviousPosts: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пост не найден",
        });
      }
      const nextPost = await ctx.db.post.findFirst({
        where: {
          category: {
            id: post.category.id,
          },
        },
        cursor: {
          id: post.id,
        },
        select: {
          slug: true,
        },
        skip: 1,
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      });
      const previousPost = await ctx.db.post.findFirst({
        where: {
          category: {
            id: post.category.id,
          },
        },
        cursor: {
          id: post.id,
        },
        select: {
          slug: true,
        },
        skip: 1,
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
      });
      return { next: nextPost?.slug, prev: previousPost?.slug };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string(), isReportage: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      try {
        await ctx.db.post.update({
          where: {
            slug: input.slug,
          },
          data: {
            views: {
              increment: 1,
            },
          },
        });
      } catch (e) {
        return null;
      }

      const post = await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },

          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
      if (!post) {
        return null;
      }

      if (ctx.session?.user) {
        const isAdmin = await isAdminUseCase();
        const like = await ctx.db.postLike.findFirst({
          where: {
            postId: post.id,
            userId: ctx.session.user.id,
          },
        });
        return {
          ...post,
          liked: !!like,
          isOwner: isAdmin || ctx.session?.user?.id === post.author.id,
        };
      }
      return {
        ...post,
        liked: false,
        isOwner: ctx.session?.user?.id === post.author.id,
      };
    }),

  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.comment.findUnique({
        where: {
          id: input.commentId,
        },
        include: {
          author: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!comment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Комментарий не найден",
        });
      }
      if (comment.author.id !== ctx.session.user.id) {
        const isAdmin = await isAdminUseCase();
        if (!isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "У вас нет прав на удаление этого комментария",
          });
        }
      }
      return await ctx.db.comment.delete({
        where: {
          id: input.commentId,
        },
      });
    }),

  getPosts: publicProcedure
    .input(
      z.object({ cursor: z.optional(z.number()), categorySlug: z.string() }),
    )
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ?? 0;
      if (input.categorySlug === "reportage") {
        const total = await ctx.db.report.count({});
        const totalPages = Math.ceil(total / 20);
        const reports = await ctx.db.report.findMany({
          include: {
            post: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: cursor * 20,
          take: 20,
        });
        const hasMore = cursor + 20 < total;
        const nextPage = hasMore ? cursor + 1 : null;
        const prevPage = cursor > 0 ? cursor - 1 : null;
        return {
          isReport: true,
          reports,
          hasMore,
          totalPages,
          total,
          nextPage,
          prevPage,
        };
      }
      const total = await ctx.db.post.count({
        where: {
          category: {
            slug: input.categorySlug,
          },
          AND: {
            report: null,
          },
        },
      });
      const totalPages = Math.ceil(total / 20);
      const posts = await ctx.db.post.findMany({
        where: {
          category: {
            slug: input.categorySlug,
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: cursor * 20,
        take: 20,
      });
      const hasMore = cursor + 20 < total;
      const nextPage = hasMore ? cursor + 1 : null;
      const prevPage = cursor > 0 ? cursor - 1 : null;
      return {
        isReport: false,
        posts,
        hasMore,
        totalPages,
        total,
        nextPage,
        prevPage,
      };
    }),
});
