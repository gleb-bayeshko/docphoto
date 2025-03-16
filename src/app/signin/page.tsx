"use client";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { CardContent, CardFooter, Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormField,
	FormDescription,
	FormControl,
	FormItem,
	FormMessage,
	FormLabel,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { signinInputSchema } from "~/server/api/schemas/auth";
import LoadingButton from "~/components/ui/loading-button";
import { Suspense, useState } from "react";
import SocialAuth from "~/components/blocks/social-auth";

export default function SigninPage() {
	const searchParams = useSearchParams();
	const afterSignup = !!searchParams.get("afterSignup");
	const afterRestore = !!searchParams.get("afterRestore");
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof signinInputSchema>>({
		resolver: zodResolver(signinInputSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signinInputSchema>) => {
		setIsLoading(true);
		const resp = await signIn("credentials", {
			email: values.email,
			password: values.password,
			redirect: false,
		});
		if (!resp) {
			setIsLoading(false);
			return;
		}
		if (!resp.error) {
			setIsLoading(false);

			router.push("/dashboard");
			return;
		}
		setIsLoading(false);

		toast({
			title: "Ошибка",
			description: resp.error,
		});
	};

	return (
		<Suspense>
			<div className="flex min-h-[100dvh] items-center justify-center bg-background">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold tracking-tight">
							Войдите в аккаунт
						</h1>
						<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Нет аккаунта?{" "}
							<Link
								className="font-medium text-gray-900 underline dark:text-gray-50"
								href="/signup"
							>
								Зарегистрируйтесь
							</Link>
						</p>
						{afterSignup && (
							<p className="my-4 rounded-xl bg-primary py-2 text-primary-foreground">
								Вы успешно зарегистрировались. <br></br>Следуйте
								инструкциям в письме, чтобы подтвердить свой
								аккаунт.
							</p>
						)}
						{afterRestore && (
							<p className="my-4 rounded-xl bg-primary py-2 text-primary-foreground">
								Пароль успешно изменен. <br></br>Теперь вы
								можете войти в свой аккаунт с новым паролем.
							</p>
						)}
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Card>
								<CardContent className="space-y-4 pt-4">
									<div className="space-y-2">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															disabled={isLoading}
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
													<FormLabel>
														Пароль
													</FormLabel>
													<FormControl>
														<Input
															disabled={isLoading}
															type="password"
															placeholder="***********"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										></FormField>
									</div>
								</CardContent>
								<CardFooter>
									<div className="w-full">
										<LoadingButton
											isLoading={isLoading}
											className="w-full"
											type="submit"
										>
											Войти
										</LoadingButton>
										<div className="h-[2px] mx-auto bg-slate-300 w-[80%] my-4"></div>
										<div className="w-full flex flex-col items-center justify-center">
											<p>или войдите через соц.сети</p>
										</div>
										<div className="mx-auto mt-2 w-[80%]">
											<SocialAuth />
										</div>
									</div>
								</CardFooter>
							</Card>
						</form>
					</Form>

					<div className="flex items-center justify-between text-sm">
						<div className="space-x-4">
							<Link
								className="font-medium text-gray-900 underline dark:text-gray-50"
								href="/forgot-password"
							>
								Забыли пароль?
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
}
