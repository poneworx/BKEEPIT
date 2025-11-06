Param(
    [switch]$DryRun
)

# Inject-Phase3Blocks.ps1
# Purpose: Inject full working implementation blocks to move from Phase 3 Stage 7 to Stage 8.
# Rules: ASCII only, UTF-8 encoding, no emojis. Creates files if missing and overwrites unless -DryRun is set.
# Logs to: docs/logs/tools/phase3-cleanup.txt

$ErrorActionPreference = "Stop"

function Write-Log($msg) {
    $logDir = "docs/logs/tools"
    if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Force -Path $logDir | Out-Null }
    $line = "$(Get-Date -Format s) - $msg"
    $line | Out-File -FilePath "$logDir/phase3-cleanup.txt" -Append -Encoding utf8
    Write-Host $line
}

function Confirm-Directory($path) {
    $dir = Split-Path $path -Parent
    if ($dir -and !(Test-Path $dir)) {
        if ($DryRun) { Write-Log "Would create directory: $dir" }
        else { New-Item -ItemType Directory -Force -Path $dir | Out-Null; Write-Log "Created directory: $dir" }
    }
}

function Write-File($path, $content) {
    Confirm-Directory $path
    if ($DryRun) {
        Write-Log "Would write: $path"
        return
    }
    $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $Utf8NoBom)
    Write-Log "Wrote: $path"
}

# -----------------------------
# Backend: tokenService.ts
# -----------------------------
$tokenService = @'
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
'@

# -----------------------------
# Backend: emailService.ts
# -----------------------------
$emailService = @'
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
'@

# -----------------------------
# Backend: validateEnv.ts
# -----------------------------
$validateEnv = @'
const REQUIRED = [
  "MONGO_URI",
  "JWT_SECRET",
  "EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "APP_BASE_URL"
] as const;

export function validateEnv(env: NodeJS.ProcessEnv = process.env) {
  const missing = REQUIRED.filter(k => !env[k] || String(env[k]).trim() === "");
  if (missing.length > 0) {
    const list = missing.join(", ");
    throw new Error(`Missing required environment variables: ${list}`);
  }
  return true;
}
'@

# -----------------------------
# Backend: receiptController.ts
# -----------------------------
$receiptController = @'
import type { Request, Response } from "express";
import * as ocr from "../services/ocrService";

export async function uploadReceipt(req: Request, res: Response) {
  try {
    // In a real setup, file comes from multer. Here we accept base64 or url in body for Phase 3.
    const image = (req.body && (req.body.base64 || req.body.url)) as string | undefined;
    if (!image) return res.status(400).json({ error: "Missing image data" });
    const parsed = await ocr.parseImage(image);
    return res.status(200).json({ parsed });
  } catch (err) {
    return res.status(500).json({ error: "Failed to parse receipt" });
  }
}
'@

# -----------------------------
# Backend: receiptRoutes.ts
# -----------------------------
$receiptRoutes = @'
import { Router } from "express";
import { uploadReceipt } from "../controllers/receiptController";

const router = Router();
router.post("/upload", uploadReceipt);
export default router;
'@

# -----------------------------
# Frontend: utils/config.ts
# -----------------------------
$frontendConfig = @'
import Constants from "expo-constants";

type AppExtra = {
  apiBaseUrl?: string;
};

export function getConfig() {
  const extra = (Constants?.expoConfig?.extra || {}) as AppExtra;
  if (!extra.apiBaseUrl) {
    throw new Error("Missing extra.apiBaseUrl in app.json");
  }
  return {
    apiBaseUrl: extra.apiBaseUrl
  };
}
'@

# -----------------------------
# Frontend: services/api.ts
# -----------------------------
$frontendApi = @'
import axios from "axios";
import { getConfig } from "../utils/config";
import { attachAuthInterceptors } from "../middleware/axiosAuthInterceptor";

const { apiBaseUrl } = getConfig();
export const api = axios.create({ baseURL: apiBaseUrl, timeout: 15000 });

attachAuthInterceptors(api);
export default api;
'@

# -----------------------------
# Frontend: middleware/axiosAuthInterceptor.ts
# -----------------------------
$frontendAxios = @'
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export function attachAuthInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
'@

# -----------------------------
# Frontend: services/email.ts
# -----------------------------
$frontendEmail = @'
import api from "./api";

export async function requestVerificationEmail(email: string) {
  const { data } = await api.post("/email/request-verify", { email });
  return data;
}

export async function requestResetPinEmail(email: string) {
  const { data } = await api.post("/email/request-reset", { email });
  return data;
}
'@

# -----------------------------
# Frontend Tests: integration auth-flow.test.tsx
# -----------------------------
$frontendTest = @'
import "react-native";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../../App";

describe("Auth flow", () => {
  it("renders login and navigates to dashboard after mock login", async () => {
    const { getByTestId, queryByText } = render(<App />);
    const email = getByTestId("login-email");
    const password = getByTestId("login-password");
    const submit = getByTestId("login-submit");

    fireEvent.changeText(email, "test@example.com");
    fireEvent.changeText(password, "Secret123!");
    fireEvent.press(submit);

    await waitFor(() => expect(queryByText(/dashboard/i)).toBeTruthy());
  });
});
'@

# Targets
$targets = @(
    @{ Path = "server/src/services/tokenService.ts"; Content = $tokenService },
    @{ Path = "server/src/services/emailService.ts"; Content = $emailService },
    @{ Path = "server/src/config/validateEnv.ts"; Content = $validateEnv },
    @{ Path = "server/src/controllers/receiptController.ts"; Content = $receiptController },
    @{ Path = "server/src/routes/receiptRoutes.ts"; Content = $receiptRoutes },
    @{ Path = "frontend/src/utils/config.ts"; Content = $frontendConfig },
    @{ Path = "frontend/src/services/api.ts"; Content = $frontendApi },
    @{ Path = "frontend/src/middleware/axiosAuthInterceptor.ts"; Content = $frontendAxios },
    @{ Path = "frontend/src/services/email.ts"; Content = $frontendEmail },
    @{ Path = "frontend/src/tests/integration/auth-flow.test.tsx"; Content = $frontendTest }
)

Write-Log "Starting Phase 3 block injection..."

foreach ($t in $targets) {
    Write-File -path $t.Path -content $t.Content
}

Write-Log "Phase 3 block injection complete."
Write-Host "Done."
