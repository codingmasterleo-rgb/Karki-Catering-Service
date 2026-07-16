import { Schema, model, models, Document, Types } from 'mongoose';
import { OwnerType } from './address';
 
export interface IEmergencyContact extends Document {
  ownerRef: Types.ObjectId;
  ownerType: OwnerType;
  name: string;
  relation: string;
  phone: string;
  email:string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
 
const EmergencyContactSchema = new Schema<IEmergencyContact>(
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
      default: 'Person',
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    relation: {
      type: String,
      required: [true, 'relation is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'phone is required'],
      trim: true,
      match: [/^9\d{9}$/, 'Enter a valid Nepali phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
EmergencyContactSchema.index({ ownerRef: 1, ownerType: 1 });
 
export const EmergencyContact =
  models.EmergencyContact || model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
