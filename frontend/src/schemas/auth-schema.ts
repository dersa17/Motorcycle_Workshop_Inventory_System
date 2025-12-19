import { email, z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});


export const updateProfileSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  newPassword: z.string().min(8, "Password minimal 8 karakter").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password confirmation tidak sesuai",
  path: ["confirmPassword"], // error akan muncul di confirmPassword
});