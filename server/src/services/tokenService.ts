import crypto from "crypto";
import { addMinutes } from "date-fns";
import EmailToken from "../models/EmailToken";
import type { Types } from "mongoose";

/**
 * Issues a one time token for email verification or PIN reset.
 * type: "verify" | "reset"
 */
export async function issueToken(userId: Types.ObjectId, type: "verify" | "reset", ttlMinutes = 30) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = addMinutes(new Date(), ttlMinutes);
  await EmailToken.create({ userId, type, token, expiresAt, used: false });
  return token;
}

/**
 * Consumes a previously issued token. Returns the document if valid.
 */
export async function consumeToken(token: string, type: "verify" | "reset") {
  const found = await EmailToken.findOne({ token, type, used: false, expiresAt: { $gt: new Date() } });
  if (!found) return null;
  found.used = true;
  await found.save();
  return found;
}