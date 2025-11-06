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