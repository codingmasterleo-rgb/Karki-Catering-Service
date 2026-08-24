import { Schema, model, models, Document, Types } from 'mongoose';



export type CustomerStatus = 'active' | 'inactive' | 'blacklisted';

export interface ICustomer extends Document {
    identity: Types.ObjectId;
    customerCode: string;
    displayName: string;
    permanentAddress?: Types.ObjectId;
    temporaryAddress?: Types.ObjectId;
    contact?: Types.ObjectId;
    emergencyContacts: Types.ObjectId[];
    documents: Types.ObjectId[];
    events: Types.ObjectId[];
    socialMediaProfiles: Types.ObjectId[];
    defaults?: Types.ObjectId;
    status: CustomerStatus;
    tags: string[];
    createdBy: Types.ObjectId;
    actionLogs: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        identity: {
            type: Schema.Types.ObjectId,
            ref: 'Identity',
            required: true,
            unique: true,
        },

        customerCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        displayName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },
        permanentAddress: {
            type: Schema.Types.ObjectId,
            ref: 'Address'
        },
        temporaryAddress: {
            type: Schema.Types.ObjectId,
            ref: 'Address'
        },

        contact: {
            type: Schema.Types.ObjectId,
            ref: 'Contact'
        },
        emergencyContacts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Contact'
            }
        ],

        documents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'CustomerDocument'
            }
        ],
        events: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event'
            }
        ],
        socialMediaProfiles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'SocialMediaProfile'
            }
        ],

        defaults: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerDefaults'
        },

        status: {
            type: String,
            enum: ['active', 'inactive', 'blacklisted'],
            default: 'active',
        },
        tags: {
            type: [String],
            default: []
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User', required: true
        },
        actionLogs: [

            {
                type: Schema.Types.ObjectId,
                ref: "ActionLog",
            }

        ],
    },
    { timestamps: true }
);

CustomerSchema.index({ identity: 1 }, { unique: true });
CustomerSchema.index({ customerCode: 1 }, { unique: true });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ tags: 1 });
CustomerSchema.index({ displayName: 'text', phone: 'text' });

export const Customer = models.Customer || model<ICustomer>('Customer', CustomerSchema);