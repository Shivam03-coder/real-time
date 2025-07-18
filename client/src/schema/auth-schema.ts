import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  name: z.string().min(1).min(4).max(100),
  phoneNumber: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string().min(5).max(1000),
  city: z.string().min(1).min(2).max(100),
  pincode: z.string().min(1).min(6).max(6),
  countryandstate: z.tuple([z.string(), z.string().optional()]),
  isAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signinSchema>;
