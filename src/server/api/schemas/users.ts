import { z } from "zod";

export const updateProfileInputSchema = z.object({
	name: z
		.undefined()
		.or(
			z
				.string()
				.min(2, { message: "Имя должно быть не менее 2 символов" }),
		)
		.optional(),
	favoriteCamera: z.string().optional(),
	username: z
		.undefined()
		.or(
			z.string().min(2, {
				message: "Имя пользователя должно быть не менее 2 символов",
			}),
		)
		.optional(),
	favoriteCategoryId: z.string().optional(),
	biography: z.string().optional(),
	occupation: z.string().optional(),
	avatar: z.string().optional(),
	workPlace: z.string().optional(),
	role: z.union([z.literal("photopgrapher"), z.literal("viewer")]).optional(),
});

export const createCameraInputSchema = z.object({
	make: z
		.string()
		.min(3, { message: "Название должно быть минимум 3 символа" })
		.max(20, {
			message: "Название должно быть максимум 20 символов",
		}),
	model: z
		.string()
		.min(2, { message: "Модель должна быть минимум 2 символа" })
		.max(20, {
			message: "Модель должна быть максимум 20 символов",
		}),
	type: z.union([
		z.literal("digital"),
		z.literal("film"),
		z.literal("phone"),
	]),
});

export const createLensInputSchema = z.object({
	make: z
		.string()
		.min(3, { message: "Название должно быть минимум 3 символа" })
		.max(20, {
			message: "Название должно быть максимум 20 символов",
		}),
	model: z
		.string()
		.min(2, { message: "Модель должна быть минимум 2 символа" })
		.max(20, {
			message: "Модель должна быть максимум 20 символов",
		}),
});
