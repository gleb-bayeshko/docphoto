"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import UserLayout from "~/components/blocks/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import IconButton from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

interface IProps {}

const schema = z.object({
  email: z.string().email(),
});

const ForgotPassword: FC<IProps> = (props) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const [isSent, setIsSent] = React.useState(false);
  const { mutateAsync: requestPasswordRestore, isPending } =
    api.auth.restorePassword.useMutation({
      onSettled() {
        setIsSent(true);
      },
    });

  const onSubmit = (values: z.infer<typeof schema>) => {
    requestPasswordRestore(values);
  };

  return (
    <UserLayout contentClassName="h-full">
      <div className="flex h-full items-center justify-center">
        {isSent && (
          <Card className="w-[400px]">
            <CardHeader>Письмо отправлено</CardHeader>
            <CardContent>
              <p>
                Мы отправили письмо на указанный адрес. Пожалуйста, проверьте
                почту.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {!isSent && (
        <div className="flex h-full items-center justify-center">
          <Form {...form}>
            <form className="w-[400px]" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <IconButton
                className="mt-4 w-full"
                icon={isPending && <Spinner />}
                disabled={isPending}
              >
                Восстановить пароль
              </IconButton>
            </form>
          </Form>
        </div>
      )}
    </UserLayout>
  );
};

export default ForgotPassword;
