"use client";
import React, { FC } from "react";
import { Vortex } from "~/components/ui/vortex";
import { RouterOutputs } from "~/trpc/react";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import { BackgroundGradientAnimation } from "~/components/ui/background-gradient-animation";
import Link from "next/link";
import ImageGrid from "~/components/blocks/image-grid";
type Post = RouterOutputs["posts"]["getTopPostsByType"]["0"];
interface IProps {
  newest: RouterOutputs["posts"]["getTop"];
  tops: {
    week: Post | undefined;
    month: Post | undefined;
  };
}

const HomePage: FC<IProps> = ({ newest: images, tops: { week, month } }) => {
  const day = { post: images[0]! };
  return (
    <div className="mt-[32px]">
      <div className="grid h-[calc(100svh-160px)]  grid-rows-[repeat(2,minmax(0,1fr))] gap-[24px] max-lg:mt-8 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 col-start-1 row-span-1 rounded-lg">
          <BackgroundGradientAnimation
            className="h-full"
            containerClassName="h-full w-full rounded-lg"
          >
            <div className="flex h-full items-center pr-14">
              <div className="flex h-full select-none flex-col items-start justify-center pl-8 text-white">
                <div className="flex items-center gap-6">
                  <p className="bg-gradient-to-b from-white/80 to-white/20 bg-clip-text text-5xl font-extrabold text-transparent drop-shadow-2xl">
                    DOCPHOTO
                  </p>
                </div>
                <p className="text-md mt-4 bg-gradient-to-b from-white/80  to-white/20 bg-clip-text font-extrabold text-transparent drop-shadow-2xl lg:max-w-[80%]">
                  Откройте мир фотографии с DOCPHOTO! Просматривайте потрясающие
                  снимки, вдохновляйтесь историями и делитесь своими работами.
                  Начните прямо сейчас!
                </p>
              </div>
              <img className="h-32 w-32" title="Logo" src="/white.png"></img>
            </div>
          </BackgroundGradientAnimation>
        </div>
        <div className="col-span-2 row-span-1 rounded-lg bg-gray-500 lg:col-span-2 lg:col-start-3 lg:row-span-2">
          {month && (
            <Link href={`/post/${month.post.slug}`}>
              <div className="relative h-full">
                <Image
                  src={month.post.imageUrl}
                  alt={month.post.name}
                  quality={100}
                  className="absolute left-0 top-0 h-full w-full rounded-lg  object-cover blur-[0.5px]"
                  width={1000}
                  height={1000}
                />
                <div className="absolute left-0  top-0 h-full w-full rounded-lg bg-black/30"></div>
                <div className="absolute bottom-[20px] left-[20px] lg:bottom-[40px] lg:left-[40px]">
                  <p className="text-[16px] font-extrabold text-[#C3C3C3]">
                    Лучшее фото месяца
                  </p>
                  <h2 className="my-3 text-4xl font-bold text-[#DADADA]">
                    {month.post.name}
                  </h2>
                  <p className="hidden max-w-[70%] text-[16px] font-light   text-white lg:block">
                    {month.post.description}
                  </p>
                  <div className="mt-3 flex">
                    <Eye className="text-[#DADADA]"></Eye>
                    <p className="ml-2 text-[16px] font-bold text-[#DADADA]">
                      {month.post.views}
                    </p>
                    <Heart className="ml-5 fill-[#DADADA] text-[#DADADA]"></Heart>
                    <p className="ml-2 text-[16px] font-bold text-[#DADADA]">
                      {month.post._count.likes}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        {day && (
          <div className="col-start-1 row-span-1 row-start-2 hidden rounded-lg bg-gray-500 lg:block">
            <Link href={`/post/${day.post.slug}`}>
              <div className="relative h-full">
                <Image
                  src={day.post.imageUrl}
                  alt={day.post.name}
                  quality={100}
                  className="absolute left-0 top-0 h-full w-full rounded-lg  object-cover blur-[0.5px]"
                  width={1000}
                  height={1000}
                />
                <div className="absolute left-0  top-0 h-full w-full rounded-lg bg-black/30"></div>
                <div className="absolute bottom-[12px] left-[12px] lg:bottom-[24px] lg:left-[24px]">
                  <p className="text-[16px] font-extrabold text-[#C3C3C3]">
                    Фото дня
                  </p>
                  <h2 className="my-3 text-4xl font-bold text-[#DADADA]">
                    {day.post.name}
                  </h2>
                  <div className="mt-3 flex">
                    <Heart className=" fill-[#DADADA] text-[#DADADA]"></Heart>
                    <p className="ml-2 text-[16px] font-bold text-[#DADADA]">
                      {day.post._count.likes}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        <div
          className={`${day ? "col-span-1 col-start-2" : "col-span-2 col-start-1"} row-span-1 row-start-2  hidden rounded-lg bg-gray-500 lg:block`}
        >
          {week && (
            <Link href={`/post/${week.post.slug}`}>
              <div className="relative h-full">
                <Image
                  src={week.post.imageUrl}
                  alt={week.post.name}
                  quality={100}
                  className="absolute left-0 top-0 h-full w-full rounded-lg  object-cover blur-[0.5px]"
                  width={1000}
                  height={1000}
                />
                <div className="absolute left-0  top-0 h-full w-full rounded-lg bg-black/30"></div>
                <div className="absolute bottom-[12px] left-[12px] lg:bottom-[24px] lg:left-[24px]">
                  <p className="text-[16px] font-extrabold text-[#C3C3C3]">
                    Лучшее фото недели
                  </p>
                  <h2 className="my-3 text-4xl font-bold text-[#DADADA]">
                    {week.post.name}
                  </h2>
                  <div className="mt-3 flex">
                    <Eye className="text-[#DADADA]"></Eye>
                    <p className="ml-2 text-[16px] font-bold text-[#DADADA]">
                      {week.post.views}
                    </p>
                    <Heart className="ml-5 fill-[#DADADA] text-[#DADADA]"></Heart>
                    <p className="ml-2 text-[16px] font-bold text-[#DADADA]">
                      {week.post._count.likes}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="mt-8"></div>
      <ImageGrid
        images={images.map((i) => ({
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
      <div className="pt-8"></div>
    </div>
  );
};

export default HomePage;
