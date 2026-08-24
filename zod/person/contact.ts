import z from "zod";

const contactBaseSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^9\d{9}$/, "Enter a valid Nepali phone number (e.g. 9812345678)"),
  email: z.string().email("Invalid email address").optional(),
  isPrimary: z.boolean().optional(), // ✅ changed
});

export const contactFormSchema = contactBaseSchema.extend({
  name: z.string().optional(),
  relation: z.string().optional(),
});

export const emergencyContactFormSchema = contactBaseSchema.extend({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
});