import z from "zod";

export const customerDefaultsFormSchema = z.object({
  creditLimit: z.number().optional(), // was .default(0)
  interestRateYearly: z.number().optional(),
  maxCreditDays: z.number().optional(),
  paymentTerm: z.enum(["credit", "cash", "advance"]).optional(), // was .default("credit")
  tdsApplicable: z.boolean().optional(), // was .default(false)
});