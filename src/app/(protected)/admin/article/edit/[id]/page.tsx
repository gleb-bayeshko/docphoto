import React, { FC } from "react";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { api } from "~/trpc/server";
import EditView from "./edit-view";
import { toPlainObject } from "~/lib/utils";
import { db } from "~/server/db";
import { getServerAuthSession } from "~/lib/session";

interface IProps {
  params: {
    id: string;
  };
}

const AdminArticleEditPage: FC<IProps> = async (props) => {
  const session = await getServerAuthSession();
  let article = await api.articles.getArticleById({ id: props.params.id });

  if (props.params.id === "rules") {
    const rulesArticle = await db.article.findFirst({
      where: {
        slug: "rules",
      },
    });
    if (!rulesArticle) {
      article = await db.article.create({
        data: {
          title: "rules_page",
          description: "rules",
          slug: "rules",
          contentJson: `{}`,
          author: {
            connect: {
              id: session!.user.id,
            },
          },
        },
      });
    } else {
      article = rulesArticle;
    }
  }
  if (!article) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold">Статья не найдена</h1>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Редактирование статьи</h1>
      <EditView hideInputs={article.slug === 'rules'} article={toPlainObject(article)} />
    </AdminLayout>
  );
};

export default AdminArticleEditPage;
