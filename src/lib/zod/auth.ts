import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Extended schema used by the signup form: includes `confirm` and `terms` and refines that password === confirm
export const registerFormSchema = registerSchema.extend({
  confirm: z.string().min(1, { message: 'Please confirm password' }),
  terms: z.boolean().refine(v => v === true, { message: 'You must accept the terms to continue' }),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm) {
    ctx.addIssue({ path: ['confirm'], code: z.ZodIssueCode.custom, message: 'Passwords do not match' });
  }
});

export type RegisterFormInput = z.infer<typeof registerFormSchema>;

export const authResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  token: z.string(),
  refreshToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
