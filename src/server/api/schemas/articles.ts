import { z } from "zod";

export const createArticleInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  contentJson: z.string(),
  description: z.string(),
});

export const editArticleInputSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, { message: "Длина заголовка должна быть от 3 до 50 символов" })
    .max(50, { message: "Длина заголовка должна быть от 3 до 50 символов" }),
  contentJson: z.string(),
  description: z.string(),
});
