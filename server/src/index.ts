import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { logger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import { env } from './config/env.js';

// ------------------------
// App setup
// ------------------------
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ------------------------
// Routes
// ------------------------
app.use('/auth', authRoutes);
app.use('/email', emailRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/', healthRoutes);

// ------------------------
// Database + Server Start
// ------------------------
mongoose
  .connect(env.mongo)
  .then(() => {
    app.listen(env.port, () => {
      logger.info(`✅ Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });
