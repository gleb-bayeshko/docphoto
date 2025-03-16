"use client";
import { cn } from "~/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import UserLayout from "~/components/blocks/layout";
import SettingsCard from "~/components/blocks/settings-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Checkbox } from "~/components/ui/checkbox";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
} from "~/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import {
	Aperture,
	Camera,
	CircleX,
	Film,
	Plus,
	Smartphone,
	Star,
	Trash,
	Video,
} from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	createCameraInputSchema,
	createLensInputSchema,
} from "~/server/api/schemas/users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import IconButton from "~/components/ui/icon-button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { $Enums } from "@prisma/client";
import { Shimmer } from "~/components/ui/shimmer";

interface IProps {}

const EquipmentSettings: FC<IProps> = (props) => {
	const {
		data: user,
		isPending,
		isFetching: isUserFetching,
		refetch: refetchUser,
	} = api.auth.getFullUser.useQuery();
	const [role, setRole] = useState("viewer");

	useEffect(() => {
		if (user) {
			setRole(user.siteRole);
		}
	}, [user]);

	// #region Camera
	const {
		isPending: setFavoriteCameraPending,
		mutateAsync: setFavoriteCamera,
	} = api.users.setFavoriteCamera.useMutation({
		onError(err) {
			toast.error(err.message);
		},
	});
	const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
	const createCameraForm = useForm<z.infer<typeof createCameraInputSchema>>({
		resolver: zodResolver(createCameraInputSchema),
		defaultValues: {
			make: "",
			model: "",
			type: "digital",
		},
	});
	const { isPending: isCameraCreatePending, mutate: createCamera } =
		api.users.createCamera.useMutation({
			onError(err) {
				toast.error(err.message);
			},
			onSuccess() {
				refetchUser().then(() => {
					setCameraDialogOpen(false);
					toast.success("Камера добавлена");
					updateRoleAsync("photopgrapher");
				});
			},
		});

	const { isPending: isCameraRemovePending, mutate: removeCamera } =
		api.users.removeCamera.useMutation({
			onError(err) {
				toast.error(err.message);
			},
			onSuccess() {
				refetchUser().then((userNew) => {
					setCameraDialogOpen(false);
					toast.success("Камера удалена");
				});
			},
		});

	//#endregion
	// #region Lens
	const [lensDialogOpen, setLensDialogOpen] = useState(false);
	const createLensForm = useForm<z.infer<typeof createLensInputSchema>>({
		resolver: zodResolver(createLensInputSchema),
		defaultValues: {
			make: "",
			model: "",
		},
	});
	const { isPending: isLensCreatePending, mutate: createLens } =
		api.users.createLens.useMutation({
			onError(err) {
				toast.error(err.message);
			},
			onSuccess() {
				refetchUser().then(() => {
					setLensDialogOpen(false);
					toast.success("Объектив добавлен");
				});
			},
		});

	const { isPending: isLensRemovePending, mutate: removeLens } =
		api.users.removeLens.useMutation({
			onError(err) {
				toast.error(err.message);
			},
			onSuccess() {
				refetchUser().then(() => {
					setLensDialogOpen(false);
					toast.success("Объектив удален");
				});
			},
		});
	// #endregion
	const updateRoleAsync = (role: $Enums.SiteRole) => {
		updateProfile({
			role: role,
		});
	};
	const setRoleAsync = (role: $Enums.SiteRole) => {
		updateRoleAsync(role);
		setRole(role);
	};
	const { isPending: isSetRolePending, mutate: updateProfile } =
		api.users.updateProfile.useMutation({
			onError(err) {
				toast.error("Не удалось изменить роль");
				setRole(user!.siteRole);
			},
		});

	if (isPending)
		return (
			<UserLayout>
				<SettingsCard>
					<Spinner />
				</SettingsCard>
			</UserLayout>
		);

	const renderCamera = (camera: {
		id: string;
		make: string;
		model: string;
	}) => {
		return renderCameraItem(
			{ ...camera, isFavorite: camera.id === user?.favoriteCameraId },
			async (id) => {
				toast.promise(
					setFavoriteCamera({ id }).then((cam) => {
						refetchUser();
						return cam;
					}),
					{
						loading: "Сохранение...",
						success: (cam) =>
							`Любимая камера изменена на ${cam.make} ${cam.model}`,
						error: "Ошибка",
					},
				);
			},
			async (props) => removeCamera(props),
		);
	};

	return (
		<UserLayout>
			<SettingsCard>
				<div className="text-base">
					<Accordion
						disabled={isSetRolePending}
						type="single"
						value={role}
						collapsible
					>
						<AccordionItem value="photopgrapher">
							<AccordionTrigger>
								<div
									onClick={() =>
										setRoleAsync("photopgrapher")
									}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={role === "photopgrapher"}
									/>
									<div className="text-base">Фотограф</div>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<Shimmer isLoaded={!isSetRolePending}>
									<div className="max-w-[350px] p-2">
										{/* {user?.cameras?.length === 0 && (
											<div className="mb-4 text-sm font-medium text-red-500">
												Вы не добавили ни одной камеры.{" "}
												<br /> Добавьте камеру, чтобы
												изменить роль
											</div>
										)} */}

										<Popover>
											<PopoverTrigger>
												<IconButton
													className="w-[200px]"
													icon={<Camera />}
													variant={"outline"}
												>
													Ваши камеры
												</IconButton>
											</PopoverTrigger>
											<PopoverContent className="z-[1000] max-h-[400px] w-[400px] overflow-y-auto overflow-x-hidden bg-white p-0">
												{user?.cameras && (
													<div
														className={cn(
															(isCameraRemovePending ||
																setFavoriteCameraPending) &&
																"pointer-events-none",
														)}
													>
														<IconButton
															icon={<Plus />}
															className="h-10 w-full"
															onClick={() =>
																setCameraDialogOpen(
																	true,
																)
															}
															variant={"ghost"}
														>
															Добавить камеру
														</IconButton>
														<SelectSeparator />
														<div className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium">
															<div className="flex items-center gap-2">
																<Video />
																Цифровые камеры
															</div>
															{(isCameraRemovePending ||
																setFavoriteCameraPending) && (
																<Spinner className="h-[16px] w-[16px]" />
															)}
														</div>
														{user.cameras.filter(
															(x) =>
																x.type ===
																"digital",
														).length === 0 && (
															<div className="flex items-center justify-center px-4 py-2 text-sm font-medium">
																Вы не добавили
																ни одной
																цифровой камеры
															</div>
														)}
														{user.cameras
															.filter(
																(x) =>
																	x.type ===
																	"digital",
															)
															.map((camera) =>
																renderCamera(
																	camera,
																),
															)}
														<SelectSeparator />
														<div className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
															<Film />
															Пленочные камеры
														</div>
														{user.cameras.filter(
															(x) =>
																x.type ===
																"film",
														).length === 0 && (
															<div className="flex items-center justify-center px-4 py-2 text-sm font-medium">
																Вы не добавили
																ни одной
																пленочной камеры
															</div>
														)}
														{user.cameras
															.filter(
																(x) =>
																	x.type ===
																	"film",
															)
															.map((camera) =>
																renderCamera(
																	camera,
																),
															)}
														<SelectSeparator />

														<div className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
															<Smartphone />
															Смартфоны
														</div>
														{user.cameras.filter(
															(x) =>
																x.type ===
																"phone",
														).length === 0 && (
															<div className="flex items-center justify-center px-4 py-2 text-sm font-medium">
																Вы не добавили
																ни одного
																смартфона
															</div>
														)}
														{user.cameras
															.filter(
																(x) =>
																	x.type ===
																	"phone",
															)
															.map((camera) =>
																renderCamera(
																	camera,
																),
															)}
													</div>
												)}
											</PopoverContent>
										</Popover>
										<Popover>
											<PopoverTrigger>
												<IconButton
													className="mt-4 w-[200px]"
													icon={<Aperture />}
													variant={"outline"}
												>
													Ваши объективы
												</IconButton>
											</PopoverTrigger>
											<PopoverContent className="z-[1000] max-h-[400px] w-[400px] overflow-y-auto overflow-x-hidden bg-white p-0">
												{user?.cameras && (
													<div
														className={cn(
															isLensRemovePending &&
																"pointer-events-none",
														)}
													>
														<IconButton
															icon={<Plus />}
															className="h-10 w-full"
															onClick={() =>
																setLensDialogOpen(
																	true,
																)
															}
															variant={"ghost"}
														>
															Добавить объектив
														</IconButton>
														<SelectSeparator />
														<div className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium">
															<div className="flex items-center gap-2">
																<Aperture />
																Объективы
															</div>
															{isLensRemovePending && (
																<Spinner className="h-[16px] w-[16px]" />
															)}
														</div>
														{user.lenses.length ===
															0 && (
															<div className="flex items-center justify-center px-4 py-2 text-sm font-medium">
																Вы не добавили
																ни одного
																объктива
															</div>
														)}
														{user.lenses.map(
															(lens) => (
																<div
																	key={
																		lens.id
																	}
																	className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium"
																>
																	<div className="flex items-center gap-2">
																		{
																			lens.make
																		}{" "}
																		{
																			lens.model
																		}
																	</div>
																	<div className="flex items-center gap-2">
																		<Button
																			className="pointer-events-auto px-0"
																			onClick={() =>
																				removeLens(
																					{
																						id: lens.id,
																					},
																				)
																			}
																			variant={
																				"ghost"
																			}
																		>
																			<Trash />
																		</Button>
																	</div>
																</div>
															),
														)}
													</div>
												)}
											</PopoverContent>
										</Popover>
									</div>
								</Shimmer>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="viewer">
							<AccordionTrigger>
								<div
									onClick={() => setRoleAsync("viewer")}
									className="flex items-center gap-2"
								>
									<Checkbox checked={role === "viewer"} />
									<div className="text-base">Зритель</div>
								</div>
							</AccordionTrigger>
						</AccordionItem>
					</Accordion>
				</div>
			</SettingsCard>
			<Dialog open={cameraDialogOpen} onOpenChange={setCameraDialogOpen}>
				<DialogContent>
					<DialogHeader className="text-lg font-bold">
						Добавление камеры
					</DialogHeader>
					<Form {...createCameraForm}>
						<form
							onSubmit={createCameraForm.handleSubmit(
								(values) => {
									createCamera(values);
								},
							)}
						>
							<FormField
								control={createCameraForm.control}
								name="make"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название</FormLabel>
										<FormControl>
											<Input
												placeholder="Canon"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							></FormField>
							<FormField
								control={createCameraForm.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Модель</FormLabel>
										<FormControl>
											<Input
												placeholder="EOS 5D Mark IV"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							></FormField>
							<FormField
								control={createCameraForm.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Тип камеры</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-white">
													<SelectValue placeholder="Выберите тип камеры" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="digital">
													Цифровая
												</SelectItem>
												<SelectItem value="film">
													Пленочная
												</SelectItem>
												<SelectItem value="phone">
													Телефон
												</SelectItem>
											</SelectContent>
										</Select>

										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							></FormField>
							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={
										isCameraCreatePending || isUserFetching
									}
								>
									Добавить
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
			<Dialog open={lensDialogOpen} onOpenChange={setLensDialogOpen}>
				<DialogContent>
					<DialogHeader className="text-lg font-bold">
						Добавление объктива
					</DialogHeader>
					<Form {...createLensForm}>
						<form
							onSubmit={createLensForm.handleSubmit((values) => {
								createLens(values);
							})}
						>
							<FormField
								control={createLensForm.control}
								name="make"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название</FormLabel>
										<FormControl>
											<Input
												placeholder="Canon"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							></FormField>
							<FormField
								control={createLensForm.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Модель</FormLabel>
										<FormControl>
											<Input
												placeholder="RF 24-105mm F4L IS"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							></FormField>
							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={
										isLensCreatePending || isUserFetching
									}
								>
									Добавить
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</UserLayout>
	);
};

export default EquipmentSettings;
function renderCameraItem(
	camera: { id: string; make: string; model: string; isFavorite: boolean },
	setFavoriteCamera: (id: string) => Promise<any>,
	removeCamera: (props: { id: string }) => Promise<any>,
): React.JSX.Element {
	return (
		<div className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium">
			<div className="flex items-center gap-2">
				{camera.make} {camera.model}
			</div>
			<div className="flex items-center gap-2">
				<Button
					className="pointer-events-auto px-0"
					onClick={() => removeCamera({ id: camera.id })}
					variant={"ghost"}
				>
					<Trash />
				</Button>
				<Button
					onClick={() => {
						setFavoriteCamera(camera.id);
					}}
					className="pointer-events-auto px-0"
					variant={"ghost"}
				>
					{!camera.isFavorite ? <Star /> : <Star fill={"black"} />}
				</Button>
			</div>
		</div>
	);
}
