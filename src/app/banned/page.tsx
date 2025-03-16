"use client";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";
import toast from "react-hot-toast";

interface IProps {}

const Banned: FC<IProps> = (props) => {
  const session = useSession();
  const params = useSearchParams();
  const reason = params.get("reason");
  const router = useRouter();
  useEffect(() => {
    if (session.status === "authenticated") {
      signOut({
        redirect: false,
      }).then(() => {
        toast.error(`Вы были заблокированы администрацией сайта: ${reason}`);
        router.push("/");
      });
    }
  }, [session]);
  return <></>;
};

export default Banned;
