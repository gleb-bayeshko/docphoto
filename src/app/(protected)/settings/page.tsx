/* eslint-disable @next/next/no-img-element */
"use client";
// eslint-disable next/next/no-img-element
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarIcon } from "@radix-ui/react-icons";
import { skipToken } from "@tanstack/react-query";
import { Info, PaperclipIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import UserLayout from "~/components/blocks/layout";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
	DialogFooter,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import IconButton from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import { Shimmer } from "~/components/ui/shimmer";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { cn, uploadFileToS3, voidToken } from "~/lib/utils";
import { updateProfileInputSchema } from "~/server/api/schemas/users";
import { api } from "~/trpc/react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { type Crop } from "react-image-crop";
import mime from "mime-types";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "~/components/ui/slider";
import SettingsHeader from "~/components/blocks/settings-header";
import SettingsCard from "~/components/blocks/settings-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

interface IProps {}

const ProfilePage: FC<IProps> = (props) => {
	const [imageUploading, setImageUploading] = useState(false);
	const {
		data: user,
		isFetching,
		refetch: refetchUser,
	} = api.auth.getFullUser.useQuery(voidToken, {
		throwOnError() {
			toast.error("Не удалось загрузить информацию");
			return false;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	const { data: categories } = api.categories.getAll.useQuery();
	const { mutateAsync: createPresignedUrls } =
		api.uploads.createPresignedUrls.useMutation();

	const router = useRouter();
	const { mutate: updateProfile, isPending } =
		api.users.updateProfile.useMutation({
			onSuccess() {
				void refetchUser();
				toast.success("Информация обновлена");
				router.push(`/author/${user?.username}`);
			},
			onError(e) {
				if (e instanceof TRPCClientError) {
					if (e.data.code === "CONFLICT") {
						toast.error(e.shape.message);
						return;
					}
				}
				toast.error("Не удалось обновить информацию");
			},
		});
	const { mutate: updateAvatar } = api.users.updateAvatar.useMutation({
		onSuccess() {
			toast.success("Фото профиля обновлено");
			void refetchUser();
			setTimeout(() => {
				setImageUploading(false);
			}, 1500);
		},
		onSettled() {
			(
				document.querySelector("#avatarPicker") as HTMLInputElement
			).value = "";
		},
		onError() {
			setImageUploading(false);
			toast.error("Не удалось обновить фото профиля");
		},
	});

	const form = useForm<z.infer<typeof updateProfileInputSchema>>({
		resolver: zodResolver(updateProfileInputSchema),
		defaultValues: {},
	});
	useEffect(() => {
		form.setValue("name", user?.name ?? "");
		form.setValue("biography", user?.biography ?? "");
		form.setValue("occupation", user?.occupation ?? "");
		form.setValue("username", user?.username ?? "");
		form.setValue("favoriteCategoryId", user?.favoriteCategoryId ?? "");
		form.setValue("role", user?.siteRole ?? undefined);
	}, [user, form]);

	const handleSubmit = async (
		values: z.infer<typeof updateProfileInputSchema>,
	) => {
		updateProfile(values);
	};
	const [src, setSrc] = useState("");
	const [open, setOpen] = useState(false);
	const [preview, setPreview] = useState("");
	const editorRef = React.useRef<AvatarEditor>(null);
	const [scale, setScale] = useState(1);

	return (
		<>
			<div
				className={cn(
					"absolute left-0 top-0 z-[2000] h-[100vh] max-h-[100vh] w-[100vw] max-w-[100vw] bg-black/10 backdrop-blur-lg",
					open ? "block" : "hidden",
				)}
			>
				<div className="h-full pt-8">
					<div className="flex h-full w-full flex-col items-center max-sm:justify-center">
						<div className="mb-6 flex w-full justify-between px-8">
							<h1 className="text-2xl font-semibold">
								Обрезать фото
							</h1>
							<X
								onClick={() => {
									setOpen(false);
									(
										document.querySelector(
											"#avatarPicker",
										) as HTMLInputElement
									).value = "";
								}}
							></X>
						</div>
						{src !== "" && (
							<div
								className="flex flex-col"
								onWheel={(e) => {
									let newScale = scale + e.deltaY * -0.001;
									newScale = Math.min(
										Math.max(1, newScale),
										3,
									);
									setScale((prev) => newScale);
								}}
							>
								<AvatarEditor
									ref={editorRef}
									image={src}
									width={300}
									height={300}
									borderRadius={9999}
									color={[255, 255, 255, 0.7]}
									scale={scale}
									rotate={0}
								></AvatarEditor>
								<div className="mt-4 h-[100px]  w-full">
									<Slider
										value={[scale]}
										min={1}
										max={3}
										step={0.05}
										onValueChange={(e) => {
											setScale(e[0]!);
											editorRef.current?.setState({});
										}}
									></Slider>
								</div>
							</div>
						)}
						<div className="lg:px-18 flex w-full justify-between px-8 pt-8 md:px-12 xl:px-20">
							<div></div>
							<Button
								onClick={async () => {
									setOpen(false);
									const url = await createPresignedUrls({
										contentType: "image/jpeg",
									});
									setImageUploading(true);

									const canvas =
										editorRef.current?.getImage();
									const [f, ...rest] = canvas!
										.toDataURL("image/jpeg")
										.split(",");
									const buffer = Buffer.from(
										rest.join(","),
										"base64",
									);
									const resp = await uploadFileToS3(
										url.url,
										buffer,
										"image/jpeg",
									);
									if (!resp.ok) {
										toast.error(
											"Не удалось загрузить файл",
										);
										setImageUploading(false);
										return;
									}
									updateAvatar({
										key: url.key,
									});
								}}
							>
								Сохранить
							</Button>
						</div>
					</div>
				</div>
			</div>
			<UserLayout contentClassName="flex">
				<SettingsCard>
					<div className="mt-4 flex max-sm:justify-center">
						<div>
							<div className="w-[128px]">
								<Shimmer isLoaded={!isFetching} circle={true}>
									<div className="relative h-[128px] w-[128px]">
										{user?.avatarUrl ? (
											<Image
												alt="Avatar"
												width={128}
												height={128}
												className="max-h-[128px] min-h-[128px] min-w-[128px] max-w-[128px] rounded-full object-cover"
												src={user.avatarUrl}
											></Image>
										) : (
											<div className="flex  h-[128px] w-[128px] items-center justify-center rounded-full bg-gray-300">
												<AvatarIcon className="h-[80px] w-[80px]" />
											</div>
										)}
										<div className="absolute left-[-1px] top-[-1px] flex h-[131px] w-[131px] items-center justify-center">
											<IconButton
												className={cn(
													imageUploading
														? "bg-white opacity-100 hover:bg-white"
														: "opacity-0",
													"h-full w-full flex-col gap-0 rounded-full backdrop-blur-md transition-all hover:bg-gray-50/50 hover:opacity-100",
												)}
												variant={"ghost"}
												onClick={(e) => {
													if (imageUploading) {
														return;
													}
													e.preventDefault();
													document
														.getElementById(
															"avatarPicker",
														)
														?.click();
												}}
												icon={
													imageUploading ? (
														<Spinner />
													) : (
														<Plus />
													)
												}
											>
												{!imageUploading && (
													<span className="text-black">
														до 1 МБ
													</span>
												)}
											</IconButton>
											<input
												title="123"
												type="file"
												accept="image/png, image/jpeg"
												id="avatarPicker"
												onChange={async (e) => {
													const file =
														e.target.files?.[0];
													if (!file) {
														return;
													}
													if (
														file.size >
														1024 * 1024
													) {
														toast.error(
															"Мы принимаем файлы до 1МБ в размере",
														);
														return;
													}
													const buffer = Buffer.from(
														await file.arrayBuffer(),
													);
													const b64 =
														buffer.toString(
															"base64",
														);
													setSrc(
														`data:${mime.contentType(file.name.split(".").pop()!)};base64,` +
															b64,
													);
													setOpen(true);
												}}
												className="hidden"
											></input>
										</div>
									</div>
								</Shimmer>
							</div>
						</div>
					</div>
					<div>
						<Form {...form}>
							<form
								className="space-y-3"
								onSubmit={form.handleSubmit(handleSubmit)}
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Имя</FormLabel>
											<FormControl>
												<Shimmer
													borderRadius={"0.75rem"}
													isLoaded={!isFetching}
												>
													<Input
														disabled={isPending}
														placeholder="Имя"
														{...field}
													/>
												</Shimmer>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								></FormField>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="">
												Имя пользователя
											</FormLabel>
											<FormControl>
												<Shimmer
													borderRadius={"0.75rem"}
													isLoaded={!isFetching}
												>
													<Input
														disabled={isPending}
														placeholder="Имя пользователя"
														{...field}
													/>
												</Shimmer>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								></FormField>
								<FormField
									control={form.control}
									name="occupation"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Профессия</FormLabel>
											<FormControl>
												<Shimmer
													borderRadius={"0.75rem"}
													isLoaded={!isFetching}
												>
													<Input
														disabled={isPending}
														placeholder="Анестезиолог-реаниматолог"
														{...field}
													/>
												</Shimmer>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								></FormField>
								<FormField
									control={form.control}
									name="biography"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Автобиография</FormLabel>
											<FormControl>
												<Shimmer
													borderRadius={"0.75rem"}
													isLoaded={!isFetching}
												>
													<Textarea
														className="min-h-[200px]"
														disabled={isPending}
														placeholder="Живу и работаю во Владивостоке"
														{...field}
													/>
												</Shimmer>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								></FormField>
								<div className="flex justify-end">
									<Shimmer
										isLoaded={!isFetching}
										borderRadius={"0.75rem"}
									>
										<IconButton
											disabled={isPending}
											icon={isPending && <Spinner />}
										>
											Сохранить
										</IconButton>
									</Shimmer>
								</div>
							</form>
						</Form>
					</div>
				</SettingsCard>
			</UserLayout>
		</>
	);
};

export default ProfilePage;
