"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

interface IProps {}

const ArticlesList: FC<IProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);
  const { data, fetchNextPage, isFetching, fetchPreviousPage } =
    api.articles.getArticles.useInfiniteQuery(
      {},
      {
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
    return data?.pages?.flatMap((x) => x.articles);
  }, [data]);
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Статьи</h1>
      <Link href="/admin/article/create">
        <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">
          Создать статью
        </button>
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {flatPosts?.map((article) => (
          <div key={article.id}>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              {article.content!.blocks.find((x) => x.type === "image")?.data
                ?.file?.url && (
                <Link
                  href={`/admin/article/edit/${article.id}`}
                  className="block"
                >
                  <Image
                    src={
                      article.content!.blocks.find((x) => x.type === "image")
                        ?.data?.file?.url
                    }
                    alt="Article Image"
                    width={400}
                    height={225}
                    className="h-48 w-full object-cover"
                  />
                </Link>
              )}
              <div className="p-6">
                <Link
                  href={`/admin/article/edit/${article.id}`}
                  className="block"
                >
                  <h2 className="mb-2 text-xl font-bold">{article.title}</h2>
                </Link>
                <p className="mb-4 text-gray-600">{article.description}</p>
                <div className="flex items-center text-gray-500">
                  {/* <Avatar className="w-8 h-8 rounded-full mr-2">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar> */}
                  <span>{article.updatedAt.toLocaleString("ru")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isFetching && <Spinner />}
        {flatPosts && (
          <div className="pointer-events-none opacity-0" ref={ref}>
            123
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticlesList;
