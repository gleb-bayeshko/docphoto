'use client'
import React, { FC } from "react";
import { RouterOutputs } from "~/trpc/react";
import { ArticleEdit } from "../../article-edit";

interface IProps {
    hideInputs?: boolean;
    article: NonNullable<RouterOutputs["articles"]["getArticleById"]>;
}

const EditView: FC<IProps> = ({ hideInputs, article }) => {
  return (
    <ArticleEdit
        hideInputs={hideInputs}
      id={article.id}
      title={article.title}
      description={article.description}
      content={article.content!}
    />
  );
};

export default EditView;
