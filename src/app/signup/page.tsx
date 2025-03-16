"use client";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupInputSchema } from "~/server/api/schemas/auth";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import LoadingButton from "~/components/ui/loading-button";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const signUp = api.auth.signup.useMutation({
    onSuccess() {
      router.push("/signin?afterSignup=true");
    },
    onError(err) {
      if (!err.data?.zodError) {
        toast({ title: "Error", description: err.message });
      }
    },
  });

  const form = useForm<z.infer<typeof signupInputSchema>>({
    resolver: zodResolver(signupInputSchema),
    defaultValues: {
      username: "",
      name: "",
      occupation: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupInputSchema>) {
    signUp.mutate(values);
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <Card className="w-full max-w-md space-y-6">
        <CardContent className="py-4">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Регистрация</h1>
              <p className="text-gray-500 dark:text-gray-400"></p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input
                            disabled={signUp.isPending}
                            placeholder="johndoe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-start-2">
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input
                            disabled={signUp.isPending}
                            placeholder="Джон"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="col-start-2">
                      <FormLabel>Профессия</FormLabel>
                      <FormControl>
                        <Input
                          disabled={signUp.isPending}
                          placeholder="Пожарник"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={signUp.isPending}
                            placeholder="johndoe@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input
                            disabled={signUp.isPending}
                            placeholder=""
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <LoadingButton
                  isLoading={signUp.isPending}
                  className="w-full"
                  type="submit"
                >
                  Зарегистрироваться
                </LoadingButton>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Уже есть аккаунт?
              <Link
                className="ml-2 font-medium underline underline-offset-2"
                href="/signin"
              >
                Войдите
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
