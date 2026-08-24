import { Schema, model, models, Document, Types } from 'mongoose';

export type IdentityRole = 'customer' | 'vendor' | 'employee';
export type IdentityStatus = 'active' | 'inactive';

export interface IIdentity extends Document {
  fullName: string;
  phone: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  avatarRef?: Types.ObjectId;

  roles: IdentityRole[];

  notes?: string;
  status: IdentityStatus;

  createdAt: Date;
  updatedAt: Date;
}

const IdentitySchema = new Schema<IIdentity>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^9\d{9}$/, 'Enter a valid Nepali phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: { type: Date },
    avatarRef: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },

    roles: {
      type: [String],
      enum: ['customer', 'vendor', 'employee'],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one role is required',
      },
    },

    notes: { type: String, trim: true, maxlength: 1000 },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

IdentitySchema.index({ phone: 1 }, { unique: true });
IdentitySchema.index({ email: 1 }, { unique: true, sparse: true });
IdentitySchema.index({ roles: 1 });
IdentitySchema.index({ fullName: 'text' });

export const Identity = models.Identity || model<IIdentity>('Identity', IdentitySchema);