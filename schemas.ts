import * as z from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "password is required" }),
  confirmPassword: z
    .string()
    .min(6, { message: "confirm password is required" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "email is required" }),
  password: z.string().min(1, { message: "password is required" }),
  code: z.optional(z.string()),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "email is required" }),
  password: z.string().min(6, { message: "password is required" }),
  name: z.string().min(1, { message: "name is required" }),
  user_name: z.string().min(1, { message: "user name is required" }),
});

export const resetSchema = z.object({
  email: z.string().email({ message: "email is required" }),
});
