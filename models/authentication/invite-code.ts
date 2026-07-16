// models/InviteCode.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { Role } from "./user";

export const ROLES = ["admin", "accountant", "inventory_manager", "employee"] as const;

export interface IInviteCode {
  code: string;
  role: Role;
  used: boolean;
  usedBy: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteCodeMethods {
  isExpired(): boolean;
  isValid(): boolean;
}

export interface InviteCodeModel extends Model<IInviteCode, {}, IInviteCodeMethods> {
  markUsed(code: string, userId: Types.ObjectId): Promise<IInviteCodeDocument | null>;
}

export type IInviteCodeDocument = Document<unknown, {}, IInviteCode> &
  IInviteCode &
  IInviteCodeMethods;

const inviteCodeSchema = new Schema<IInviteCode, InviteCodeModel, IInviteCodeMethods>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
      required: true,
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL index — MongoDB khud delete karega document jab expiresAt nikal jaye.
// NOTE: yeh used codes ko bhi expire hote hi permanently delete kar dega,
// isliye agar audit trail chahiye lambe time ke liye, iss index ko hata ke
// query-time expiry-check + cron-based archival lagana padega.
inviteCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

inviteCodeSchema.methods.isExpired = function (this: IInviteCodeDocument): boolean {
  return this.expiresAt.getTime() < Date.now();
};

inviteCodeSchema.methods.isValid = function (this: IInviteCodeDocument): boolean {
  return !this.used && !this.isExpired();
};

// Atomic operation — race condition se bachne ke liye. Do log same second mein
// same code use karein toh dusra automatically null payega, kyunki
// findOneAndUpdate ek hi query mein check + update dono karta hai.
inviteCodeSchema.statics.markUsed = async function (
  code: string,
  userId: Types.ObjectId
): Promise<IInviteCodeDocument | null> {
  return this.findOneAndUpdate(
    { code, used: false, expiresAt: { $gt: new Date() } },
    { used: true, usedBy: userId },
    { new: true }
  );
};

const InviteCode =
  (mongoose.models.InviteCode as InviteCodeModel) ||
  mongoose.model<IInviteCode, InviteCodeModel>("InviteCode", inviteCodeSchema);

export default InviteCode;