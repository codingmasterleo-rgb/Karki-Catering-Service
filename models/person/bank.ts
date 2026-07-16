 
import { Schema, model, models, Document, Types } from 'mongoose';
import { OwnerType } from './address';

export interface IBankDetail extends Document {
  ownerRef: Types.ObjectId;
  ownerType: OwnerType;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
 
const BankDetailSchema = new Schema<IBankDetail>(
  {
    ownerRef: {
      type: Schema.Types.ObjectId,
      required: [true, 'ownerRef is required'],
      refPath: 'ownerType',
    },
    ownerType: {
      type: String,
      required: [true, 'ownerType is required'],
      enum: ['Person', 'Company'],
    },
    bankName: {
      type: String,
      required: [true, 'bankName is required'],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'accountNumber is required'],
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: [true, 'accountHolderName is required'],
      trim: true,
    },
    branch: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
BankDetailSchema.index({ ownerRef: 1, ownerType: 1 });
BankDetailSchema.index({ ownerRef: 1, ownerType: 1, bankName: 1, accountNumber: 1 }, { unique: true });
 
export const BankDetail = models.BankDetail || model<IBankDetail>('BankDetail', BankDetailSchema);
