import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollection extends Document {
  userId: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  memoryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    coverPhoto: { type: String },
    memoryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CollectionSchema.index({ userId: 1, name: 1 });

const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
