import z from "zod";

export const customerDefaultsFormSchema = z.object({
  creditLimit: z.number().optional(),
  interestRateYearly: z.number().optional(),
  maxCreditDays: z.number().optional(),
  paymentTerm: z.enum(["credit", "cash", "advance"]).optional(),
  tdsApplicable: z.boolean().optional(),
});