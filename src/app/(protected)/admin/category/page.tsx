"use client";
import Link from "next/link";
import React, { FC } from "react";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface IProps {}

const AdminCategory: FC<IProps> = (props) => {
  const { data: categories } = api.categories.getAll.useQuery();
  return (
    <AdminLayout>
      <div className="flex gap-4">
        <h1>Категории</h1>
        <Link href="/admin/category/create">
          <Button variant="link">Создать</Button>
        </Link>
      </div>
      <div className="grid max-h-[400px] grid-cols-2 flex-wrap gap-4 md:grid-cols-3">
        {categories?.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Button variant="link">{category.name}</Button>
          </Link>
        ))}
        {!categories && <p>Загрузка...</p>}
      </div>
      
    </AdminLayout>
  );
};

export default AdminCategory;
