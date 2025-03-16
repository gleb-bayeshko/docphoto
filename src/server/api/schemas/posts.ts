import { z } from "zod";

export const createContentInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  description: z.string(),
  categoryId: z
    .string({ message: "Категория не выбрана" })
    .refine((a) => a !== "none", "Категория не выбрана"),
  imageKey: z.string(),
  albumId: z.optional(z.string()),
  tags: z.array(z.string()),
  cameraId: z.optional(z.string()),
  camera: z.optional(z.string()),
  lensId: z.optional(z.string()),
  createDate: z.optional(z.date()),
  iso: z.optional(z.coerce.number()),
  focusLength: z.optional(z.number()),
  aperture: z.optional(z.number()),
  exposureTime: z.optional(z.number()),
});

export const updateContentInputSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  description: z.string(),
});

export const updateReportageInputSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  description: z.string(),
});

export const createReportageInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  description: z
    .string()
    .min(100, { message: "Длина описания должна быть от 100 до 350 символов" })
    .max(1000, {
      message: "Длина описания должна быть от 100 до 1000 символов",
    }),
  imageKeys: z.array(z.string()),
});

export const createCommentInputSchema = z.object({
  postId: z.string(),
  text: z
    .string()
    .min(3, { message: "Длина комментария должна быть от 3 до 350 символов" })
    .max(350, {
      message: "Длина комментария должна быть от 3 до 350 символов",
    }),
});
