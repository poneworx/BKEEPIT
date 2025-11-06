import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String },
  emailVerified: { type: Boolean, default: false },
  pinHash: { type: String, default: null }
}, { timestamps: true });
export default mongoose.model('User', UserSchema);