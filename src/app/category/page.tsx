import Link from "next/link";
import UserLayout from "~/components/blocks/layout";
import { api } from "~/trpc/server";

const CategoriesView = async () => {
  const categories = await api.categories.getAll();
  return (
    <UserLayout>
      <h1 className="text-[28px] font-bold mb-4">Категории</h1>
      <div className="grid max-h-[400px] grid-cols-2 flex-wrap gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            {category.name}
          </Link>
        ))}
      </div>
    </UserLayout>
  );
};
export default CategoriesView;
