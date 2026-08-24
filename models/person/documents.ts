import { Schema, model, models, Document, Types } from "mongoose";

export type DocumentOwnerType = "Person" | "Company";

export type DocumentType =
  | "citizenship"
  | "pan"
  | "passport"
  | "registration"
  | "license"
  | "agreement"
  | "contract"
  | "certificate"
  | "insurance"
  | "tax"
  | "other";

export interface IDocument extends Document {
  ownerRef: Types.ObjectId;
  ownerType: DocumentOwnerType;
  documentType: DocumentType;
  documentNumber: string;
  title?: string;
  description?: string;
  issuedBy?: string;
  issuedDistrict?: string;
  issuedDate?: Date;
  expiryDate?: Date;
  mediaRefs: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    ownerRef: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner reference is required"],
      refPath: "ownerType",
      index: true,
    },

    ownerType: {
      type: String,
      required: [true, "Owner type is required"],
      enum: ["Person", "Company"],
      index: true,
    },

    documentType: {
      type: String,
      required: [true, "Document type is required"],
      enum: [
        "citizenship",
        "pan",
        "passport",
        "registration",
        "license",
        "agreement",
        "contract",
        "certificate",
        "insurance",
        "tax",
        "other",
      ],
      index: true,
    },

    documentNumber: {
      type: String,
      required: [true, "Document number is required"],
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    issuedBy: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    issuedDistrict: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    issuedDate: Date,

    expiryDate: Date,

    mediaRefs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "documents",
  }
);


DocumentSchema.index(
  {
    ownerRef: 1,
    ownerType: 1,
    documentType: 1,
  },
  {
    unique: true,
  }
);


DocumentSchema.index(
  {
    documentType: 1,
    documentNumber: 1,
  },
  {
    unique: true,
  }
);

DocumentSchema.index({ ownerRef: 1, createdAt: -1 });
DocumentSchema.index({ expiryDate: 1 });



DocumentSchema.pre("save", function (next) {
  if (
    this.issuedDate &&
    this.expiryDate &&
    this.expiryDate < this.issuedDate
  ) {
    return next(
      new Error("Expiry date cannot be earlier than issued date.")
    );
  }

  next();
});

export const Documents =
  models.Documents || model<IDocument>("Documents", DocumentSchema);

export default Documents;