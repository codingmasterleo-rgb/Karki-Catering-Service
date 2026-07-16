// models/User.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";

export const ROLES = ["admin", "accountant", "inventory_manager", "employee"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["pending", "approved", "removed", "deleted"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const LOG_ACTIONS = [
  "created",
  "email_verified",
  "approved",
  "removed",
  "deleted",
  "role_changed",
  "login",
  "login_failed",
  "password_changed",
] as const;
export type LogAction = (typeof LOG_ACTIONS)[number];

export interface IUserLog {
  action: LogAction;
  performedBy: Types.ObjectId | null; // null = system-generated (jaise email verify link click)
  note: string | null;
  timestamp: Date;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  invitationCode: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifyToken: string | null;
  emailVerifyTokenExpiry: Date | null;
  profileDetails: Types.ObjectId | null; // future: alag "Profile" collection ka reference hoga
  logs: IUserLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  addLog(action: LogAction, performedBy?: Types.ObjectId | null, note?: string | null): void;
  isApproved(): boolean;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
}

export type IUserDocument = Document<unknown, {}, IUser> & IUser & IUserMethods;

const userLogSchema = new Schema<IUserLog>(
  {
    action: { type: String, enum: LOG_ACTIONS, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    note: { type: String, default: null },
    timestamp: { type: Date, default: () => new Date(), required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      select: false, // login ke waqt explicitly .select("+password") lagana hoga
    },
    invitationCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "pending",
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerifyTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    profileDetails: {
      type: Schema.Types.ObjectId,
      ref: "Profile", // jab wo collection banegi, tabhi kaam aayega
      default: null,
    },
    logs: {
      type: [userLogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.addLog = function (
  this: IUserDocument,
  action: LogAction,
  performedBy: Types.ObjectId | null = null,
  note: string | null = null
): void {
  this.logs.push({ action, performedBy, note, timestamp: new Date() });
};

userSchema.methods.isApproved = function (this: IUserDocument): boolean {
  return this.status === "approved" && this.emailVerified;
};

userSchema.statics.findByEmailWithPassword = async function (
  this: UserModel,
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).select("+password");
};

const User =
  (mongoose.models.User as UserModel) || mongoose.model<IUser, UserModel>("User", userSchema);

export default User;