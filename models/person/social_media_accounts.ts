import { Schema, model, models, Document, Types } from "mongoose";

export type SocialMediaOwnerType = "Person" | "Company";

export interface ISocialMediaAccount extends Document {
    ownerRef: Types.ObjectId;
    ownerType: SocialMediaOwnerType;

    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    linkedin?: string;
    tiktok?: string;
    skype?: string;

    createdAt: Date;
    updatedAt: Date;
}

const SocialMediaAccountSchema = new Schema<ISocialMediaAccount>(
    {
        ownerRef: {
            type: Schema.Types.ObjectId,
            required: [true, "Owner is required"],
            refPath: "ownerType",
            index: true,
        },

        ownerType: {
            type: String,
            required: [true, "Owner type is required"],
            enum: ["Person", "Company"],
        },

        facebook: {
            type: String,
            trim: true,
        },

        instagram: {
            type: String,
            trim: true,
        },

        whatsapp: {
            type: String,
            trim: true,
        },

        telegram: {
            type: String,
            trim: true,
        },

        linkedin: {
            type: String,
            trim: true,
        },

        tiktok: {
            type: String,
            trim: true,
        },

        skype: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "social_media_accounts",
    }
);

// One social media record per owner
SocialMediaAccountSchema.index(
    { ownerRef: 1, ownerType: 1 },
    { unique: true }
);

export const SocialMediaAccount =
    models.SocialMediaAccount ||
    model<ISocialMediaAccount>(
        "SocialMediaAccount",
        SocialMediaAccountSchema
    );

export default SocialMediaAccount;