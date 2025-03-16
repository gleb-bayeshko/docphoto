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
import dayjs from "dayjs";

interface IProps {
  params: {
    by: string;
  };
}

const DatePicker = ({
  date,
  onChange: setDate,
}: {
  date: Date | undefined;
  onChange: (e: Date | undefined) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => setDate(e)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const PicksPage: FC<IProps> = ({ params: { by } }) => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(dayjs().startOf("day").toDate());
  const isValid = useMemo(
    () => ["week", "day", "newest", "month"].includes(by),
    [by],
  );

  useEffect(() => {
    if (!isValid) {
      router.push("/");
    }
  }, [isValid]);

  const { data: topPosts, isFetching } = api.posts.getTop.useQuery(
    { day: date, type: by as any },
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
        {by === "day"
          ? "Фото дня"
          : by === "week"
            ? "Фото недели"
            : by === "month"
              ? "Фото месяца"
              : "Новые работы"}
      </h1>
      {/* {by === "day" && <DatePicker date={date} onChange={setDate} />} */}
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
