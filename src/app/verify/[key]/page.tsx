import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import { env } from "~/env";
import { decrypt } from "~/lib/utils";
import { db } from "~/server/db";
import ResendVerificationCodeButton from "./resend-verification-code-button";
import { addDays } from "date-fns";

interface IProps {
  params: {
    key: string;
  };
}

const VerificationPage: FC<IProps> = async ({ params: { key } }) => {
  const user = await db.user.findFirst({
    where: {
      verificationCode: decodeURIComponent(key),
    },
  });
  if (!user) {
    return (
      <UserLayout>
        <h1 className="text-3xl font-bold tracking-tight">
          Подтверждение аккаунта
        </h1>
        <div className="mt-4">
          <p>Ссылка не найдена</p>
        </div>
      </UserLayout>
    );
  }
  const expiresAt = addDays(
    user.verificationCodeResendRequestedAt || new Date(),
    1,
  );

  if (user.emailVerified) {
    return (
      <UserLayout>
        <h1 className="text-3xl font-bold tracking-tight">
          Подтверждение аккаунта
        </h1>
        <div className="mt-4">
          <p>Пользователь уже подтвержден.</p>
        </div>
      </UserLayout>
    );
  } else {
    if (expiresAt > new Date()) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
          verificationCode: null,
          verificationCodeResendRequestedAt: null,
        },
      });
    }
  }
  return (
    <UserLayout>
      <h1 className="text-3xl font-bold tracking-tight">
        Подтверждение аккаунта
      </h1>
      <div className="mt-4">
        {expiresAt < new Date() ? (
          <div className="flex items-center gap-2">
            <p>Упс, эта ссылка истекла</p>
            <ResendVerificationCodeButton email={user.email!} />
          </div>
        ) : (
          <p>Пользователь {user.email} подтвержден. </p>
        )}
      </div>
    </UserLayout>
  );
};

export default VerificationPage;
