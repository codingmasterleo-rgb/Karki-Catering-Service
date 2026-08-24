import z from "zod";

export const addressFormSchema = z.object({
  label: z.enum(["home", "office", "warehouse", "other"]).optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  isPrimary: z.boolean().optional(), // ✅ changed from .default(false)
});