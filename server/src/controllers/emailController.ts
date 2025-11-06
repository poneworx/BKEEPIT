import { Request, Response } from 'express';
import User from '../models/User.js';
import { issueToken, consumeToken } from '../services/tokenService.js';
import { sendVerificationEmail, sendResetPinEmail } from '../services/emailService.js';
import { hash } from '../utils/crypto.js';

export async function confirmEmail(req:Request,res:Response){
  const token = String(req.body.token||'');
  const userId = await consumeToken(token,'verify');
  if(!userId) return res.status(400).json({ error:'token' });
  await User.findByIdAndUpdate(userId, { emailVerified:true });
  res.json({ ok:true });
}
export async function requestReset(req:Request,res:Response){
  const email = String(req.body.email||'');
  const user = await User.findOne({ email }); if(!user) return res.json({ ok:true });
  const token = await issueToken(user.id,'reset'); await sendResetPinEmail(user.email, token);
  res.json({ ok:true });
}
export async function confirmReset(req:Request,res:Response){
  const token=String(req.body.token||''); const pin=String(req.body.pin||'');
  const userId = await consumeToken(token,'reset');
  if(!userId || !/^[0-9]{4}$/.test(pin)) return res.status(400).json({ error:'invalid' });
  await User.findByIdAndUpdate(userId, { pinHash: await hash(pin) }); res.json({ ok:true });
}