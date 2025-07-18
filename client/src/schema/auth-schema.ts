import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  name: z.string().min(1).min(4).max(100),
  email: z.string().email(),
  password: z.string(),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signinSchema>;
