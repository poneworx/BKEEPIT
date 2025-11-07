import { Request, Response } from "express";
import User from "../models/User.js";
import { hash, verify } from "../utils/crypto.js";
import { issueToken } from "../services/tokenService.js";
import { sendVerificationEmail } from "../services/emailService.js";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "invalid" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: "exists" });
  }

  const user = await User.create({
    email,
    passwordHash: await hash(password),
    emailVerified: false,
  });

  if (!user?.email) {
    return res.status(500).json({ error: "missing email" });
  }

  const token = await issueToken(user.id, "verify");
  await sendVerificationEmail(user.email, token);

  return res.status(201).json({ ok: true });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "invalid" });
  }

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "auth" });
  }

  const ok = await verify(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "auth" });
  }

  res.json({
    ok: true,
    userId: user.id,
    emailVerified: user.emailVerified,
  });
}

export async function setPin(req: Request, res: Response) {
  const pin = String(req.body.pin || "");
  const userId = String(req.headers["x-user-id"] || "");

  if (!/^[0-9]{4}$/.test(pin) || !userId) {
    return res.status(400).json({ error: "invalid" });
  }

  await User.findByIdAndUpdate(userId, { pinHash: await hash(pin) });
  res.json({ ok: true });
}
