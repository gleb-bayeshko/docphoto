"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

interface IProps {
  token: string;
  email: string;
}
const schema = z
  .object({
    token: z.string(),
    email: z.string().optional(),
    password: z.string().min(8, { message: "Минимум 8 символов" }),
    passwordConfirmation: z.string().min(8, { message: "Минимум 8 символов" }),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Пароли не совпадают",
        path: ["passwordConfirmation"],
      });
    }
  });

const RestorePasswordForm: FC<IProps> = (props) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: props.email,
      token: props.token,
      password: "",
      passwordConfirmation: "",
    },
  });
  const router = useRouter();
  const { isPending, mutateAsync: restorePasswordWithToken } =
    api.auth.restorePasswordWithToken.useMutation({
      onSuccess() {
        router.push("/signin?afterRestore=true");
      },
      onError(e) {
        toast.error(e.message);
      },
    });
  const onSubmit = (values: z.infer<typeof schema>) => {
    const { passwordConfirmation, email, ...rest } = values;
    restorePasswordWithToken(rest);
  };
  return (
    <div className="flex items-center mt-6 justify-center">
      <Form {...form}>
        <form className="w-[400px]" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            disabled={true}
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
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
  );
};

export default RestorePasswordForm;
