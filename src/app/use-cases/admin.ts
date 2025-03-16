import { getServerAuthSession } from "~/lib/session";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

export const isAdminUseCase = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return false;
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  return user?.role === "admin";
};
