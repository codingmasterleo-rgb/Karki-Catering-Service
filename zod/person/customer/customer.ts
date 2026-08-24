import z from "zod";
import { identitySchema } from "../identity";
import { addressFormSchema } from "../address";
import { contactFormSchema, emergencyContactFormSchema } from "../contact";
import { DocumentFormSchema } from "../documents";
import { socialMediaAccountFormSchema } from "../social_accounts";
import { customerDefaultsFormSchema } from "./customer_defaults";

export const customerFormSchema = z.object({
    identity: identitySchema,
    customerCode: z.string()
        .min(6, "Customer Code Can't Be Less Than 6 Character")
        .max(20, "Customer Code Can't Be More Than 20 Character"),
    displayName: z.string()
        .min(3, "Customer Code Can't Be Less Than 3 Character")
        .max(42, "Customer Code Can't Be More Than 42 Character"),
    permanentAddress: addressFormSchema,
    temporaryAddress: addressFormSchema,
    contact: contactFormSchema,
    emergencyContact: z.array(emergencyContactFormSchema),
    documents: z.array(DocumentFormSchema),
    socialMediaProfiles: socialMediaAccountFormSchema,
    defaults: customerDefaultsFormSchema,
});