import { z } from "zod";

const urlField = z
  .string()
  .trim()
  .url("Please enter a valid URL.")
  .optional()
  .or(z.literal(""));

export const socialMediaAccountFormSchema = z.object({
  facebook: urlField,
  instagram: urlField,
  whatsapp: urlField,
  telegram: urlField,
  linkedin: urlField,
  tiktok: urlField,
  skype: urlField,
});

export type SocialMediaAccountFormValues = z.infer<
  typeof socialMediaAccountFormSchema
>;