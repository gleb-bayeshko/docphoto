import nodemailer from "nodemailer";
import { env } from "~/env";
import { encrypt } from "./utils";
import { nanoid } from "nanoid";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
dayjs.locale({
    ...ru,
    weekStart: 1
})
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const transporter = nodemailer.createTransport({
  host: "smtp.timeweb.ru",
  port: 465,
  secure: true,
  auth: {
    user: "notify@docphoto.pro",
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: 'DocPhoto" <notify@docphoto.pro>',
    to,
    subject,
    html,
  });
};

export async function sendVerificationCode(input: { email: string }) {
  const user = await db.user.findFirst({
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
  if (user.emailVerified) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Пользователь уже подтвержден",
    });
  }
  if (user.verificationCodeResendRequestedAt) {
    if (
      dayjs
        .utc(user.verificationCodeResendRequestedAt)
        .add(6, "hour")
        .toDate() > new Date()
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Вы уже отправили запрос на подтверждение",
      });
    }
  }

  const verificationToken = encrypt(nanoid(), env.NEXTAUTH_SECRET!).toString();
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationCode: verificationToken,
      verificationCodeResendRequestedAt: new Date(),
    },
  });

  await sendEmail(
    input.email,
    "Подтверждение аккаунта",
    `<h1>Подтверждение аккаунта</h1>
  <p>Для подтверждения вашего аккаунта перейдите по <a href="${env.NEXTAUTH_URL}/verify/${encodeURIComponent(verificationToken)}">ссылке</a></p>`,
  );
}
