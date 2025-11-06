import mongoose, { Schema } from 'mongoose';
const EmailTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  type: { type: String, enum: ['verify','reset'], index: true },
  token: { type: String, unique: true, index: true },
  expiresAt: { type: Date, index: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('EmailToken', EmailTokenSchema);