import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { categoriesRouter } from "./routers/categories";
import { uploadsRouter } from "./routers/uploads";
import { usersRouter } from "./routers/users";
import { postsRouter } from "./routers/posts";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { articlesRouter } from "./routers/articles";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  uploads: uploadsRouter,
  users: usersRouter,
  categories: categoriesRouter,
  posts: postsRouter,
  articles: articlesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

