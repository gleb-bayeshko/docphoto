import { addDays } from "date-fns";
import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import { env } from "~/env";
import { decrypt } from "~/lib/utils";
import { db } from "~/server/db";
import RestorePasswordForm from "./restore-form";

interface IProps {
  params: {
    key: string;
  };
}

const RestorePassword: FC<IProps> = async ({ params: { key } }) => {
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: decodeURIComponent(key),
    },
  });
  if (!user) {
    return (
      <UserLayout>
        <h1 className="text-3xl font-bold tracking-tight">
          Восстановление пароля
        </h1>
        <div className="mt-4">
          <p>Ссылка не найдена</p>
        </div>
      </UserLayout>
    );
  }
  if (
    addDays(user.passwordResetTokenRequestedAt || new Date(), 1) < new Date()
  ) {
    return (
      <UserLayout>
        <h1 className="text-3xl font-bold tracking-tight">
          Восстановление пароля
        </h1>
        <div className="mt-4">
          <p>Ссылка устарела</p>
        </div>
      </UserLayout>
    );
  }
  return (
    <UserLayout>
      <h1 className="text-3xl font-bold tracking-tight">
        Восстановление пароля
      </h1>
      <RestorePasswordForm email={user.email!} token={decodeURIComponent(key)} />
    </UserLayout>
  );

  return <div></div>;
};

export default RestorePassword;
