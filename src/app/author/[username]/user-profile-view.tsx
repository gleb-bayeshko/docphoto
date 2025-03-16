"use client";
import React, { FC, useEffect, useMemo } from "react";
import { RouterOutputs, api } from "~/trpc/react";
import Image from "next/image";
import { DirectionAwareHover } from "~/components/ui/direction-aware-hover";
import ImageGrid, {
  calculateAspectRatioFit,
} from "~/components/blocks/image-grid";
import Link from "next/link";
import { useIntersectionObserver } from "usehooks-ts";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";

interface IProps {
  user: RouterOutputs["users"]["getUserProfileByUsername"];
  isAdmin?: boolean;
}

const UserProfileView: FC<IProps> = (props) => {
  const user = props.user!;
  const lastPost = user.lastPost;
  const router = useRouter();

  const [isBanned, setIsBanned] = React.useState(user.isBanned);
  const { mutateAsync: ban } = api.users.banUser.useMutation({
    onError(e) {
      toast.error(e.message);
    },
  });
  const { mutateAsync: unban } = api.users.unbanUser.useMutation({
    onError(e) {
      toast.error(e.message);
    },
  });
  useEffect(() => {
    router.refresh();
  }, []);
  const { data, fetchNextPage, isFetching, fetchPreviousPage } =
    api.posts.getAuthorPostsByUsername.useInfiniteQuery(
      {
        username: user.username,
      },
      {
        enabled: user.siteRole === "photopgrapher",
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        getNextPageParam: (lastPage) => {
          return lastPage.nextPage ?? undefined;
        },
      },
    );
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: false,
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  const flatPosts = useMemo(() => {
    return data?.pages?.flatMap((x) => x.posts);
  }, [data]);

  const { width, height } = lastPost
    ? calculateAspectRatioFit(lastPost.width, lastPost.height, 350, 421)
    : { width: 0, height: 0 };
  return (
    <div className="max-sm:mt-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-start">
            <div>
              <Image
                draggable={false}
                src={user.avatarUrl ?? "/no-avatar.webp"}
                width={120}
                height={120}
                className="rounded-full"
                alt={user.username}
              />

              {user.siteRole === "viewer" && (
                <div className="mt-2 flex items-center gap-2">
                  <Eye className="text-gray-500" />
                  <p className="text-gray-500">Зритель</p>
                </div>
              )}
              {props.isAdmin && (
                <div>
                  {isBanned && (
                    <Button
                      onClick={(e) =>
                        unban({ id: user.id }).then(() => setIsBanned(false))
                      }
                    >
                      Разблокировать
                    </Button>
                  )}
                  {!isBanned && (
                    <Button
                      onClick={(e) =>
                        ban({
                          id: user.id,
                          reason: "Нарушение правил сообщества",
                        }).then(() => setIsBanned(true))
                      }
                      variant={"destructive"}
                    >
                      Заблокировать
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="ml-4 mt-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>
          <div className="mt-4 text-sm font-normal lg:max-w-[700px]">
            <p>Автобиография: {user.biography}</p>
            {user.occupation && <p>Профессия: {user.occupation}</p>}
            {user.siteRole === "photopgrapher" && user.favoriteCamera && (
              <p>
                Любимая камера:{" "}
                {user.favoriteCamera.type === "film"
                  ? "пленочная"
                  : user.favoriteCamera.type === "phone"
                    ? "смартфон"
                    : "цифровая"}{" "}
                {user.favoriteCamera.make} {user.favoriteCamera.model}
              </p>
            )}
          </div>
        </div>
        {user.siteRole === "photopgrapher" && lastPost && (
          <Link
            className="max-sm:mt-4"
            href={`/post/${lastPost.slug}`}
            style={
              {
                "--height": `${height}px`,
                "--width": `${width}px`,
              } as React.CSSProperties
            }
          >
            <DirectionAwareHover
              className={`w-[100vw] max-sm:rounded-none md:h-[var(--height)] md:w-[var(--width)]`}
              image={
                <Image
                  draggable={false}
                  className={`scale-[1.2] object-cover`}
                  alt={"User uploaded image"}
                  src={lastPost.imageUrl}
                  width={10000}
                  height={10000}
                />
              }
            >
              <div>
                <p className="text-lg font-bold">Последняя работа</p>
                <p className="text-sm font-medium">{lastPost.name}</p>
              </div>
            </DirectionAwareHover>
          </Link>
        )}
      </div>
      {user.siteRole === "photopgrapher" && flatPosts && (
        <div>
          <h1 className="my-4 text-[28px] font-bold">Работы автора</h1>
          <ImageGrid
            images={flatPosts.map((i) => ({
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
                    <div></div>
                    <div>
                      <h3 className="text-lg font-bold">{i.name}</h3>
                    </div>
                  </div>
                </div>
              ),
            }))}
            className="mb-4"
          />
          {flatPosts.length > 0 && (
            <div className="pointer-events-none opacity-0" ref={ref}>
              123
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
