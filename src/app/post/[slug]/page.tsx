import { Item } from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";
import PostView from "./post-view";
import { toPlainObject } from "~/lib/utils";

interface IProps {
  params: {
    slug: string;
  };
}

const PostPage: FC<IProps> = async ({ params: { slug } }) => {
  const post = await api.posts.getBySlug({ slug });
  if (!post) {
    return notFound();
  }
  return <PostView post={toPlainObject(post)} />;
};

export default PostPage;
