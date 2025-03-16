import { redirect } from "next/navigation";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";
import HomePage from "./home-page";
import { toPlainObject } from "~/lib/utils";

export default async function Home() {
  const newest = await api.posts.getTop({ type: "newest", limit: 20 });
  const tops = {
    month: (
      await api.posts.getTopPostsByType({ type: "month", cursor: 0, limit: 1 })
    )[0],
    week: (
      await api.posts.getTopPostsByType({ type: "week", cursor: 0, limit: 1 })
    )[0],
  };
  return (
    <UserLayout
      contentClassName="h-full"
      containerClassName="h-[calc(100vh-200px)]"
    >
      <HomePage newest={toPlainObject(newest)} tops={toPlainObject(tops)} />
    </UserLayout>
  );
}
