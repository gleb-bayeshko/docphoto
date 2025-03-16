"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Calendar } from "~/components/ui/calendar";
import { useRouter } from "next/navigation";
import UserLayout from "~/components/blocks/layout";
import { Spinner } from "~/components/ui/spinner";
import Image from "next/image";
import ImageGrid from "~/components/blocks/image-grid";

interface IProps {
  params: {
    by: string;
  };
}

const PicksPage: FC<IProps> = ({ params: { by } }) => {
  const router = useRouter();
  const isValid = useMemo(
    () => ["rating", "comments", "views"].includes(by),
    [by],
  );

  useEffect(() => {
    if (!isValid) {
      router.push("/");
    }
  }, [isValid]);

  const { data: topPosts, isFetching } = api.posts.getBestBy.useQuery(
    { type: (by === "rating" ? "likes" : by) as any },
    {
      enabled: isValid,
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <UserLayout>
      <h1 className="text-2xl font-bold">
        {by === "rating" && "Лучшие фото по рейтингу"}
        {by === "comments" && "Лучшие фото по обсуждению"}
        {by === "views" && "Лучшие фото по просмотрам"}
      </h1>
      <div className="mt-4">
        {!topPosts && <Spinner />}
        {topPosts && topPosts.length === 0 && <p>Упс, ничего не найдено</p>}
        {topPosts && (
          <ImageGrid
            images={topPosts.map((i) => ({
              id: i.id,
              src: i.imageUrl,
              height: i.height,
              width: i.width,
              uploadDate: i.createdAt,
              childrenClassName: "",
              href: `/post/${i.slug}`,
              children: (
                <div>
                  <div className="flex items-end gap-2">
                    {i.author.avatarUrl && (
                      <Image
                        alt="Avatar"
                        className="rounded-full"
                        width={32}
                        height={32}
                        
                        src={i.author.avatarUrl}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{i.name}</h3>
                      <p className="text-sm">{i.author.username}</p>
                    </div>
                  </div>
                </div>
              ),
            }))}
            className="mb-4"
          />
        )}
      </div>
    </UserLayout>
  );
};

export default PicksPage;
