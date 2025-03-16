"use client";
import { Prisma } from "@prisma/client";
import { HeaderNavigationDesktop } from "./header-nav-desktop";
import { AvatarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menu, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ExpandableSearch } from "./expandable-search";
import { getServerAuthSession } from "~/lib/session";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Spinner } from "../ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const mobileHeaderLinkClassName =
  "flex flex-1 items-center border-b justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180";

export const Header = ({
  categories,
}: {
  categories: Prisma.CategoryGetPayload<object>[];
}) => {
  const { data: session, status } = useSession();
  return (
    <div className="px-[8px] pt-[16px] sm:px-[16px] lg:mt-[16px] lg:px-[32px] xl:px-[72px] 2xl:px-[128px]">
      <header className="flex h-[72px] w-full items-center justify-between rounded-full border-2 border-gray-400 bg-white px-[32px]">
        <Link href={'/'} className="hidden text-[20px] font-bold lg:block cursor-pointer">DOCPHOTO</Link>
        <Sheet>
          <SheetTrigger asChild>
            <Menu className="block lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="z-[2000]">
            <SheetHeader>
              <SheetTitle>DOCPHOTO</SheetTitle>
            </SheetHeader>
            <div className="">
              <Accordion type="single" collapsible>
                <Link className={mobileHeaderLinkClassName} href={"/"}>
                  Главная
                </Link>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Категории</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {categories
                        .filter((_, i) => i < 6)
                        .map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                          >
                            {category.name}
                          </Link>
                        ))}
                      <Link href={"/category"}>
                        <Button className="m-0 h-fit p-0 py-0" variant={"link"}>
                          Все категории
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Лучшие работы</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {(
                        [
                          ["По рейтингу", "/top/rating"],
                          ["По просмотрам", "/top/views"],
                          ["По обсуждению", "/top/comments"],
                        ] as const
                      ).map(([name, href]) => (
                        <Link className="" key={name} href={href}>
                          {name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Подборки</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {(
                        [
                          ["Новые работы", "/picks/newest"],
                          ["Фото дня", "/picks/day"],
                          ["Фото недели", "/picks/week"],
                          ["Фото месяца", "/picks/month"],
                        ] as const
                      ).map(([name, href]) => (
                        <Link className="" key={name} href={href}>
                          {name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Link className={mobileHeaderLinkClassName} href={"/category/reportage"}>
                  Репортажи
                </Link>
                
                 <Link className={mobileHeaderLinkClassName} href={"/article"}>
                  Статьи
                </Link>
                <Link className={mobileHeaderLinkClassName} href={"/article/rules"}>
                  Правила
                </Link>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <HeaderNavigationDesktop categories={categories} />
        </div>
        <div className="flex items-center gap-4">
          {/* <div>
            <ExpandableSearch />
          </div> */}
          {session && (
            
      <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus className="h-7 w-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={`/upload`}>Загрузить фото</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/upload-reportage">Загрузить репортаж</Link>
                </DropdownMenuItem>
                
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <AvatarIcon className="h-[32px] w-[32px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={`/author/${session.user.name}`}>Профиль</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="w-full my-1 border-b"></DropdownMenuSeparator>
                <DropdownMenuItem>
                  <Link href="/settings">Настройки</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="#"
                    onClick={() => signOut()}
                    className="text-red-500"
                  >
                    Выйти
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {status === "unauthenticated" && (
            <Link href="/signin">
              <Button>Войти</Button>
            </Link>
          )}
          {status === "loading" && <Spinner />}
        </div>
      </header>
    </div>
  );
};
