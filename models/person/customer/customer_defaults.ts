import { model } from "mongoose";
import { models } from "mongoose";
import { Schema } from "mongoose";

export type PaymentTerm = 'advance' | 'net15' | 'net30' | 'credit' | 'cod';

export interface ICustomerDefaults {
  paymentTerm: PaymentTerm;
  creditLimit: number; 
  maxCreditDays: number; 
  interestRateYearly: number; 
  tdsApplicable: boolean;  
}

const CustomerDefaultsSchema = new Schema<ICustomerDefaults>(
  {
    paymentTerm: {
      type: String,
      enum: ['advance', 'net15', 'net30', 'credit', 'cod'],
      required: true,
      default: 'advance',
    },
    creditLimit: { type: Number, default: 0, min: 0 },
    maxCreditDays: { type: Number, default: 0, min: 0 },
    interestRateYearly: { type: Number, default: 0, min: 0, max: 100 },
    tdsApplicable: { type: Boolean, default: false },
  },
  { _id: false } // embedded, no independent identity needed
);

export const CustomerDefaults = models.CustomerDefaults || model<ICustomerDefaults>('Identity', CustomerDefaultsSchema);