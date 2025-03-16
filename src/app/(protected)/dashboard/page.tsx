import Link from "next/link";
import { Button } from "~/components/ui/button";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  redirect("/");
  const fullUser = await api.auth.getFullUser();
  return (
    <UserLayout>
      <pre>{JSON.stringify(fullUser, null, 2)}</pre>
    </UserLayout>
  );
}
