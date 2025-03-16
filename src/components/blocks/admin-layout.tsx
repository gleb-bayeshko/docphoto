/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qU2dIp6eeqO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Book,
  Edit,
  HomeIcon,
  MenuIcon,
  Newspaper,
  UsersIcon,
} from "lucide-react";
import { ReactNode } from "react";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed hidden min-h-screen w-64 flex-col border-r bg-background p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-lg font-semibold">DOCPHOTO Admin</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            Главная
          </Link>
          <Link
            href="/admin/article"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <Newspaper className="h-5 w-5" />
            Статьи
          </Link>
          <Link
            href="/admin/category"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <Book className="h-5 w-5" />
            Категории
          </Link>
          <Link
            href="/admin/article/edit/rules"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <Edit className="h-5 w-5" />
            Правила
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <UsersIcon className="h-5 w-5" />
            Пользователи
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2  rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <ArrowLeft className="h-5 w-5" />
            На сайт
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col lg:ml-64">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
