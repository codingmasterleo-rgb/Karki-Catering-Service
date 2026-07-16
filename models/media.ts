import { Schema, model, models, Document, Types } from 'mongoose'

export type MediaOwnerType = 'Person' | 'Company' | 'Event';
export type MediaPurpose = 'avatar' | 'logo' | 'document' | 'gallery' | 'other';
export type MediaSide = 'front' | 'back' | 'n/a';

export interface IMedia extends Document {
  ownerRef: Types.ObjectId;
  ownerType: MediaOwnerType;
  purpose: MediaPurpose;
  side: MediaSide;
  publicId: string;
  url: string;
  format?: string; 
  width?: number;
  height?: number;
  bytes?: number;

  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    ownerRef: {
      type: Schema.Types.ObjectId,
      required: [true, 'ownerRef is required'],
      refPath: 'ownerType',
    },
    ownerType: {
      type: String,
      required: [true, 'ownerType is required'],
      enum: ['Person', 'Company', 'Event'],
    },
    purpose: {
      type: String,
      enum: ['avatar', 'logo', 'document', 'gallery', 'other'],
      default: 'other',
    },
    side: {
      type: String,
      enum: ['front', 'back', 'n/a'],
      default: 'n/a',
    },

    publicId: {
      type: String,
      required: [true, 'publicId is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'url is required'],
      trim: true,
    },
    format: { type: String, trim: true },
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number },

    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MediaSchema.index({ ownerRef: 1, ownerType: 1, purpose: 1 });
MediaSchema.index({ publicId: 1 }, { unique: true });

export const Media = models.Media || model<IMedia>('Media', MediaSchema);