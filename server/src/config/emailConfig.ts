import nodemailer from 'nodemailer';
import { env } from './env.js';
export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: false,
  auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined
});
export const sender = 'bkeepit <no-reply@bkeepit.dev>';