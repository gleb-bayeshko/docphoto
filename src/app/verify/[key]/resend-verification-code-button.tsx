"use client";
import { TRPCError } from "@trpc/server";
import React, { FC } from "react";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/ui/icon-button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

interface IProps {
  email: string;
}

const ResendVerificationCodeButton: FC<IProps> = ({ email }) => {
  const [isSent, setIsSent] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const { mutateAsync: resendVerificationCodeAsync, isPending } =
    api.auth.resendVerificationCode.useMutation({
      onSettled: () => {
        setIsSent(true);
      },
    });
  return (
    <IconButton
      onClick={async () => {
        try {
          await resendVerificationCodeAsync({ email });
          setMessage("Код отправлен");
        } catch (error) {
            if (error instanceof TRPCError) {
                setMessage(error.message);
            } else {
                setMessage("Что-то пошло не так")
            }
        }
      }}
      icon={isPending && <Spinner />}
      disabled={isPending || isSent}
      variant={"link"}
    >
      {isSent ? message : "Попробуем новую?"}
    </IconButton>
  );
};

export default ResendVerificationCodeButton;
