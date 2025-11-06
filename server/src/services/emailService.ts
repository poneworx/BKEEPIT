import transporter from "../config/emailConfig";
import { renderFile } from "ejs";
import path from "path";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

async function send({ to, subject, html }: SendArgs) {
  await transporter.sendMail({ to, subject, html });
}

export async function sendVerificationEmail(to: string, link: string) {
  const templatePath = path.resolve(__dirname, "../templates/verifyEmail.html");
  let html: string;
  try {
    html = await renderFile(templatePath, { link });
  } catch {
    html = `<p>Verify your email by clicking <a href="${link}">this link</a>.</p>`;
  }
  await send({ to, subject: "Verify your email", html });
}

export async function sendResetPinEmail(to: string, link: string) {
  const templatePath = path.resolve(__dirname, "../templates/resetPin.html");
  let html: string;
  try {
    html = await renderFile(templatePath, { link });
  } catch {
    html = `<p>Reset your PIN by clicking <a href="${link}">this link</a>.</p>`;
  }
  await send({ to, subject: "Reset your PIN", html });
}