"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Prisma } from "@prisma/client";
import { Button } from "../ui/button";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";

export function HeaderNavigationDesktop({
  categories,
}: {
  categories: Prisma.CategoryGetPayload<object>[];
}) {
  return (
    <NavigationMenu className="z-[101] bg-white">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Категории</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white">
            <div>
              <ul className="flex max-h-[300px] w-[500px] flex-col flex-wrap p-4 pb-2 ">
                {categories
                  .filter((_, i) => i < 12)
                  .map((category) => (
                    <ListItem
                      className="w-[230px]"
                      key={category.id}
                      href={`/category/${category.slug}`}
                      title={category.name}
                    />
                  ))}
              </ul>
              <div className="flex justify-between pb-4 pl-4 pr-4">
                <div></div>
                <a href={"/category"}>
                  <Button variant={"link"}>Показать все категории</Button>
                </a>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span>Лучшие работы</span>
            <span className="ml-8">Подборки</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex w-[500px]">
              <ul className="flex max-h-[300px] w-1/2 flex-col flex-wrap p-4 pb-2 ">
                <li className="mb-2 ml-2 text-[15px] font-semibold">
                  Лучшие работы
                </li>
                {(
                  [
                    ["По рейтингу", "/top/rating"],
                    ["По просмотрам", "/top/views"],
                    ["По обсуждению", "/top/comments"],
                  ] as const
                ).map(([name, href]) => (
                  <ListItem className="" key={name} href={href} title={name} />
                ))}
              </ul>
              <ul className="flex max-h-[300px] w-1/2 flex-col flex-wrap p-4 pb-2 ">
                <li className="mb-2 ml-2 text-[15px] font-semibold">
                  Подборки
                </li>

                {(
                  [
                    ["Новые работы", "/picks/newest"],
                    ["Фото дня", "/picks/day"],
                    ["Фото недели", "/picks/week"],
                    ["Фото месяца", "/picks/month"],
                  ] as const
                ).map(([name, href], i) => (
                  <ListItem key={name} href={href} title={name} />
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="block xl:hidden">
          <NavigationMenuTrigger>
            <span>Другое</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex w-[500px]">
              <ul className="flex max-h-[300px] w-1/2 flex-col flex-wrap pr-4">
                <BackgroundGradientAnimation containerClassName="max-h-[200px] max-w-[250px]" />
              </ul>
              <ul className="flex max-h-[300px] w-1/2 flex-col flex-wrap p-4 pb-2 ">
                <li className="mb-2 ml-2 text-[15px] font-semibold">
                  Другое
                </li>

                {(
                  [
                    ["Репортажи", "/category/reportage"],
                    ["Статьи", "/article"],
                    ["Правила", "/article/rules"],
                  ] as const
                ).map(([name, href], i) => (
                  <ListItem key={name} href={href} title={name} />
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden xl:block">
          <Link href="/category/reportage" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Репортажи
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
         <NavigationMenuItem className="hidden xl:block">
          <Link href="/article" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Статьи
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden xl:block">
          <Link href="/article/rules" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Правила
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
