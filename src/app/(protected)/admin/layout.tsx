import { notFound } from "next/navigation";
import React, { FC, ReactNode } from "react";
import { api } from "~/trpc/server";

interface IProps {
  children: ReactNode;
}

const Admin = async ({ children }: IProps) => {
  const fullUser = await api.auth.getFullUser();
  if (fullUser.role !== "admin") {
    return notFound();
  }
  return children;
};

export default Admin;
