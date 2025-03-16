"use client";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import toast, { CheckmarkIcon } from "react-hot-toast";
import ImageGrid from "~/components/blocks/image-grid";
import UserLayout from "~/components/blocks/layout";
import { Button } from "~/components/ui/button";
import { RouterOutputs, api } from "~/trpc/react";
import Loader from "~/components/ui/loader";
import { useRouter } from "next/navigation";

interface IProps {
  reportage: NonNullable<RouterOutputs["posts"]["getReportage"]>;
}

const ReportageView: FC<IProps> = ({ reportage }) => {
  const mainPhoto = reportage!.post![0]!;
  const createdAt = new Date(reportage.createdAt!);

  const { mutateAsync: deleteReportageMutation } =
    api.posts.removeReportage.useMutation();

  const router = useRouter();

  const deletePost = async () => {
    const abortSignal = new AbortController();
    toast.promise(
      new Promise((r, rj) => {
        let count = 0;
        const interval = setInterval(() => {
          if (abortSignal.signal.aborted) {
            r("CANCEL");
            return;
          }
          if (count >= 55) {
            clearInterval(interval);
            deleteReportageMutation({ reportageId: reportage.id! }).then(() =>
              router.push("/"),
            );
            r("OK");
          }
          count += 1;
        }, 100);
      }),
      {
        loading: (
          <div className="flex w-full  items-center justify-between">
            <div>Вы уверены?</div>
            <Button variant={"ghost"} onClick={() => abortSignal.abort()}>
              Отменить
            </Button>
          </div>
        ),
        success: (e) => (e === "CANCEL" ? "Отменено" : "Репортаж удален"),
        error: <div>Ошибка при удалении</div>,
      },
      {
        className: "w-[95vw] h-[60px] md:w-[500px]",
        loading: {
          icon: <Loader duration={5} />,
        },
        success: {
          icon: <CheckmarkIcon />,
        },
        error: {
          icon: <Trash />,
        },
        position: "bottom-center",
      },
    );
  };

  return (
    <UserLayout>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex  h-full max-h-[80vh] items-center">
          <Image
            src={mainPhoto.imageUrl}
            alt="123"
            className="w-full max-h-[80vh]  m-auto object-contain rounded-xl"
            width={10000}
            height={10000}
          />
        </div>
        <div className="flex w-full  items-center">
          <div className="w-full">
            <div className="flex flex-col justify-between">
              <div className="flex justify-between">
                <Link
                  href={`/author/${mainPhoto.author.username}`}
                  className="flex gap-2"
                >
                  <Image
                    alt="123"
                    className="rounded-full"
                    src={mainPhoto.author.avatarUrl ?? "/no-avatar.webp"}
                    width={64}
                    height={64}
                  ></Image>

                  <p>{mainPhoto.author.username}</p>
                </Link>
                <p>{createdAt.toLocaleString("ru")}</p>
              </div>
              <div className="mt-16">
                <h1 className="text-2xl font-bold">{mainPhoto.name}</h1>
                <p className="mt-10 max-w-[85%] break-words">
                  {mainPhoto.description}
                </p>
              </div>
              <div>
                {reportage.isOwner && (
                  <Button
                    variant={"link"}
                    onClick={deletePost}
                    className="mt-4 px-0 text-red-500"
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageGrid
        imageWidth={450}
        images={reportage!.post!.slice(1).map((i) => ({
          id: i.id,
          src: i.imageUrl,
          height: i.height,
          width: i.width,
          uploadDate: i.createdAt,
          childrenClassName: "",
          href: `#`,
          children: <></>,
        }))}
        className="mt-8"
      />
    </UserLayout>
  );
};

export default ReportageView;
