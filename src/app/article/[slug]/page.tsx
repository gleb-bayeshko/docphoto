import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import RichText from "~/components/lib/editorjs";
import { api } from "~/trpc/server";

interface IProps {
  params: {
    slug: string;
  };
}

const ArticleView: FC<IProps> = async (props) => {
  const article = await api.articles.getArticleBySlug({
    slug: props.params.slug,
  });
  if (!article) {
    return (
      <UserLayout>
        <h1 className="text-2xl font-bold">Статья не найдена</h1>
      </UserLayout>
    );
  }
  return (
    <UserLayout contentClassName="flex justify-center">
      <div>
        <h1 className="text-2xl font-bold">
          {article.title === "rules_page" ? "" : article.title}
        </h1>
        <RichText defaultValue={article.content!} readonly={true} />
        <span>Редакция от: {article.updatedAt.toLocaleString("ru")}</span>
      </div>
    </UserLayout>
  );
};

export default ArticleView;
