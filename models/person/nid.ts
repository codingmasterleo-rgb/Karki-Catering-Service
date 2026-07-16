import { Schema, model, models, Document, Types } from 'mongoose';

export type NationalIdOwnerType = 'Person' | 'Company';
export type IdType = 'citizenship' | 'pan' | 'passport' | 'registration' | 'other';

export interface INationalId extends Document {
  ownerRef: Types.ObjectId;
  ownerType: NationalIdOwnerType;

  idType: IdType;
  idNumber: string;

  issuedDistrict?: string;
  issuedDate?: Date;
  expiryDate?: Date;

  mediaRefs: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const NationalIdSchema = new Schema<INationalId>(
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

    idType: {
      type: String,
      enum: ['citizenship', 'pan', 'passport', 'registration', 'other'],
      required: [true, 'idType is required'],
    },
    idNumber: {
      type: String,
      required: [true, 'idNumber is required'],
      trim: true,
    },

    issuedDistrict: { type: String, trim: true },
    issuedDate: { type: Date },
    expiryDate: { type: Date },

    mediaRefs: {
      type: [Schema.Types.ObjectId],
      ref: 'Media',
      default: [],
    },
  },
  { timestamps: true }
);

// Same owner can't have the same idType logged twice (e.g. two citizenship entries)
NationalIdSchema.index({ ownerRef: 1, ownerType: 1, idType: 1 }, { unique: true });
// No two owners (person or company) should share the same id number for the same id type
NationalIdSchema.index({ idType: 1, idNumber: 1 }, { unique: true });

export const NationalId = models.NationalId || model<INationalId>('NationalId', NationalIdSchema);