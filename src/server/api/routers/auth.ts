import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { signinInputSchema, signupInputSchema } from "../schemas/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { sendEmail, sendVerificationCode } from "~/lib/mail";
import { env } from "~/env";
import { encrypt } from "~/lib/utils";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
dayjs.locale({
  ...ru,
  weekStart: 1,
});
import utc from "dayjs/plugin/utc";
import { nanoid } from "nanoid";
import { db } from "~/server/db";
dayjs.extend(utc);

export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(signinInputSchema)
    .output(z.object({ id: z.string(), email: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const isValid = await bcrypt.compare(
        input.password,
        user.hashedPassword!,
      );

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Неверный пароль",
        });
      }
      return {
        id: user.id,
        email: user.email!,
        name: user.username,
      };
    }),

  resendVerificationCode: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await sendVerificationCode(input);

      return {
        success: true,
      };
    }),

  restorePasswordWithToken: publicProcedure
    .input(z.object({ token: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          passwordResetToken: input.token,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenRequestedAt: null,
        },
      });

      await sendEmail(
        user.email!,
        "Пароль изменен",
        `<h1>Пароль изменен</h1>
<p>Пароль аккаунта ${user.email!} был изменен</p>`,
      );
      return {
        success: true,
      };
    }),

  restorePassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      const verificationToken = encrypt(
        nanoid(),
        env.NEXTAUTH_SECRET!,
      ).toString();
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordResetToken: verificationToken,
          passwordResetTokenRequestedAt: new Date(),
        },
      });

      await sendEmail(
        input.email,
        "Восстановление пароля",
        `<h1>Восстановление пароля</h1>
<p>Мы получили запрос на восстановление пароля, если это были не вы - проигнорируйте это письмо</p>
<p>Для восстановления пароля перейдите по <a href="${env.NEXTAUTH_URL}/restore-password/${encodeURIComponent(verificationToken)}">ссылке</a></p>`,
      );

      return {
        success: true,
      };
    }),

  signup: publicProcedure
    .input(signupInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const verificationToken = encrypt(
          nanoid(),
          env.NEXTAUTH_SECRET!,
        ).toString();
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            username: input.username,
            email: input.email,
            hashedPassword: hashedPassword,
            verificationCode: verificationToken,
            verificationCodeResendRequestedAt: dayjs.utc().toDate(),
          },
        });

        await sendEmail(
          input.email,
          "Регистрация",
          `<h1>Добро пожаловать!</h1>
<p>Вы успешно зарегистрировались на нашем сайте</p>
<p>Для подтверждения вашего аккаунта перейдите по <a href="${env.NEXTAUTH_URL}/verify/${encodeURIComponent(verificationToken)}">ссылке</a></p>`,
        );
        return {
          id: user.id,
        };
      } catch (error) {
        const err = error as any;
        const jsonError = JSON.parse(JSON.stringify(err));
        if (
          "name" in jsonError &&
          "code" in jsonError &&
          jsonError.name === "PrismaClientKnownRequestError" &&
          jsonError.code === "P2002"
        ) {
          const prismaError = err as PrismaClientKnownRequestError;
          const target = prismaError.meta?.target as string[];
          console.log(target);
          if (target?.includes("email")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Пользователь с таким email уже существует",
            });
          }
          if (target?.includes("username")) {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Пользователь с таким именем пользователя уже существует",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Ошибка сервера",
        });
      }
    }),

  getFullUser: protectedProcedure.query(async ({ ctx }) => {
    const userData = await ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        lenses: true,
        cameras: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...user } = userData!;

    return user;
  }),
});
