export const env = {
  port: Number(process.env.PORT || 3000),
  mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/bkeepit',
  tokenSecret: process.env.TOKEN_SECRET || 'change-me',
  tokenTtl: Number(process.env.TOKEN_TTL_MINUTES || 30),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'exp://localhost:19000',
  smtpHost: process.env.SMTP_HOST || 'localhost',
  smtpPort: Number(process.env.SMTP_PORT || 1025),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || ''
};