import mongoose, { Schema, Document } from "mongoose";

export interface IReceipt extends Document {
  filename: string;
  filepath: string;
  text: string;
  uploadedAt: Date;
}

const ReceiptSchema: Schema = new Schema<IReceipt>({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  text: { type: String, required: false },
  uploadedAt: { type: Date, default: Date.now },
});

export const Receipt = mongoose.model<IReceipt>("Receipt", ReceiptSchema);
