import { z } from "zod";

export const signinInputSchema = z.object({
  email: z.string().email({ message: "Неверный формат email" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" }),
});

export const signupInputSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно быть не менее 2 символов" })
    .max(50, { message: "Имя должно быть не более 50 символов" }),
  username: z
    .string()
    .min(6, { message: "Имя пользователя должно быть не менее 6 символов" })
    .max(32, { message: "Имя пользователя должно быть не более 32 символов" })
    .refine(
      (value) => {
        return /^[a-zA-Z0-9_-]+$/.test(value);
      },
      {
        message: "Только латинские буквы, цифры, дефис и нижнее подчеркивание",
      },
    ),
  occupation: z
    .string()
    .min(5, { message: "Профессия должна быть не менее 5 символов" }),
  email: z.string().email({ message: "Неверный формат email" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" }),
});
