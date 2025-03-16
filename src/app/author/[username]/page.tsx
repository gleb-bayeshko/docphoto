import { notFound } from "next/navigation";
import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";
import UserProfileView from "./user-profile-view";
import { isAdminUseCase } from "~/app/use-cases/admin";

interface IProps {
  params: {
    username: string;
  };
}
export const dynamic = "force-dynamic";
export const revalidate = 0;

const AuthorPage: FC<IProps> = async ({ params: { username } }) => {
  const user = await api.users.getUserProfileByUsername({ username });
  if (!user) {
    return notFound();
  }
  const isAdmin = await isAdminUseCase()
  return (
    <UserLayout>
      <UserProfileView isAdmin={isAdmin} user={user} />
    </UserLayout>
  );
};

export default AuthorPage;
