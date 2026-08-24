import z from "zod";

export const identitySchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(120),
  phone: z.string().regex(/^9\d{9}$/, "Enter a valid Nepali phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.date().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  roles: z
    .array(z.enum(["customer", "vendor", "employee"]))
    .min(1, "Select at least one role"),
  notes: z.string().max(1000).optional(),
});