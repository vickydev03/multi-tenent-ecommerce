import z from "zod";
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "username must be less than 63 characters ")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contains lowercase letters, numbers hyphens."
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
