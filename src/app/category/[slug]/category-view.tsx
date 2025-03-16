"use client";
import { Copse } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import ImageGrid from "~/components/blocks/image-grid";
import { RouterOutputs, api } from "~/trpc/react";

interface IProps {
  initialData: RouterOutputs["posts"]["getPosts"];
  slug: string;
}

const CategoryView: FC<IProps> = ({ initialData, slug }) => {
  const isReportage = slug === "reportage";
  const { data, fetchNextPage, isFetching, fetchPreviousPage } =
    api.posts.getPosts.useInfiniteQuery(
      {
        categorySlug: slug,
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialData: { pages: [initialData], pageParams: [] },
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
    console.log(data?.pages)
    return data?.pages?.flatMap((x) =>
      isReportage
        ? x!.reports!.map((y) => ({ ...y.post[0]!, slug: y.slug }))
        : x.posts!,
    );
  }, [data]);

  const router = useRouter();

  if (!flatPosts) {
    return <div></div>;
  }

  return (
    <>
      <ImageGrid
        images={flatPosts.map((i) => ({
          id: i.id,
          src: i.imageUrl,
          height: i.height,
          width: i.width,
          uploadDate: i.createdAt,
          childrenClassName: "",
          href: `/${isReportage ? "reportage" : "post"}/${i.slug}`,
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
      {flatPosts.length > 0 && (
        <div className="pointer-events-none opacity-0" ref={ref}>
          123
        </div>
      )}
    </>
  );
};

export default CategoryView;
