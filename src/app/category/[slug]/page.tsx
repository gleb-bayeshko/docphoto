
import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";
import CategoryView from "./category-view";
import { toPlainObject } from "~/lib/utils";
import { notFound } from "next/navigation";

interface IProps {
    params: {
        slug: string
    }
}
export const revalidate = 0;

const CategoryPage:FC<IProps> = async ({params: {slug}}) => {
    const category = await api.categories.getBySlug({slug})
    if (!category) {
        return notFound()
    }
    const initialData = await api.posts.getPosts({
        categorySlug: slug,
        cursor: 0,
    })
    return (
        <UserLayout>
            <h1 className="text-[28px] font-bold mb-4">{category.name}</h1>
            <CategoryView initialData={toPlainObject(initialData)} slug={slug} />
        </UserLayout>
    )
};

export default CategoryPage;