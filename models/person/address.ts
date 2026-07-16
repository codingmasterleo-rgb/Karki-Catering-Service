import { Schema, model, models, Document, Types } from 'mongoose';




export type OwnerType = 'Person' | 'Company';
export interface IAddress extends Document {
  ownerRef: Types.ObjectId;
  ownerType: OwnerType;
  label?: 'home' | 'office' | 'warehouse' | 'other';
  street?: string;
  city?: string;
  district?: string;
  country?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
 
const AddressSchema = new Schema<IAddress>(
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
    label: {
      type: String,
      enum: ['home', 'office', 'warehouse', 'other'],
      default: 'office',
    },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Nepal' },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
AddressSchema.index({ ownerRef: 1, ownerType: 1 });
 
export const Address = models.Address || model<IAddress>('Address', AddressSchema);
 
