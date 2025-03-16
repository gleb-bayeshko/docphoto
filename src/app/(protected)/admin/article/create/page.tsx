"use client";
import React, { FC, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import RichText from "~/components/lib/editorjs";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { ArticleEdit } from "../article-edit";

interface IProps {}

const AdminCreateArticlePage: FC<IProps> = (props) => {
  return <AdminLayout>
    <h1 className="text-2xl font-bold">
        Создание статьи
    </h1>
    <ArticleEdit />
  </AdminLayout>
};

export default AdminCreateArticlePage;
