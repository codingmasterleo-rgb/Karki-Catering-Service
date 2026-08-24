import { z } from "zod";

export const DocumentTypeSchema = z.enum([
  "citizenship",
  "pan",
  "passport",
  "registration",
  "license",
  "agreement",
  "contract",
  "certificate",
  "insurance",
  "tax",
  "other",
]);

export const DocumentFormSchema = z
  .object({
    documentType: DocumentTypeSchema,
    documentNumber: z
      .string({ error: "Document number is required." })
      .trim()
      .min(1, "Document number is required.")
      .max(100, "Document number cannot exceed 100 characters.")
      .transform((v) => v.toUpperCase()),
    title: z.string().trim().max(200).optional().or(z.literal("")),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    issuedBy: z.string().trim().max(200).optional().or(z.literal("")),
    issuedDistrict: z.string().trim().max(100).optional().or(z.literal("")),
    issuedDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    mediaRefs: z.array(z.string()).optional(), // ✅ changed from .default([])
  })
  .superRefine((data, ctx) => {
    if (data.issuedDate && data.expiryDate && data.expiryDate < data.issuedDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Expiry date cannot be earlier than issued date.",
      });
    }
  });

export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;