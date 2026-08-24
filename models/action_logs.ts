import { model, models, Schema } from "mongoose";
import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IActionLog extends Document {
    action: string;
    performedBy: Types.ObjectId;
    performedAt: Date;
    details?: string;
}

const ActionLogSchema = new Schema<IActionLog>(
    {
        action: {
            type: String,
            required: [true, "Action is required"],
            trim: true,
            maxlength: [100, "Action cannot exceed 100 characters"],
            index: true,
        },

        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Performed By is required"],
            index: true,
        },

        performedAt: {
            type: Date,
            default: Date.now,
            required: true,
            index: true,
        },

        details: {
            type: String,
            trim: true,
            maxlength: [5000, "Details cannot exceed 5000 characters"],
            default: "",
        },
    },
    {
        timestamps: false,
        versionKey: false,
        collection: "action_logs",

        toObject: {
            virtuals: true,
        },
    }
);


ActionLogSchema.index({ performedAt: -1 });

ActionLogSchema.index({ performedBy: 1, performedAt: -1 });

ActionLogSchema.index({ action: 1 });


export const ActionLog =
    models.ActionLog ||
    model<IActionLog>("ActionLog", ActionLogSchema);

export default ActionLog;