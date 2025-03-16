"use client";
import React, { FC } from "react";
import { Header } from "./header";
import { api } from "~/trpc/react";
import { cn, layoutPaddings, voidToken } from "~/lib/utils";



interface IProps {
  children: React.ReactNode;
  containerClassName?: string;
  contentClassName?: string;
  withPadding?: boolean;
}

const UserLayout: FC<IProps> = ({
  children,
  containerClassName,
  contentClassName,
  withPadding,
}) => {
  withPadding = withPadding ?? true;
  const categories = api.categories.getAll.useQuery(voidToken, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <div className={cn(containerClassName)}>
      <Header categories={categories.data ?? []} />
      <main className={cn(withPadding ? layoutPaddings() : "", contentClassName)}>
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
