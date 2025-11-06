import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../server/src/models/User.js';
import { hash } from '../server/src/utils/crypto.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bkeepit');
  const email = 'test@bkeepit.dev';
  const passwordHash = await hash('Password123');
  const existing = await User.findOne({ email });
  if (!existing) await User.create({ email, passwordHash, emailVerified: false });
  console.log('Seed complete');
  await mongoose.disconnect();
}
main();