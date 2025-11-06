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
import { env } from './config/env.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 100, standardHeaders:true, legacyHeaders:false }));

app.use('/auth', authRoutes);
app.use('/email', emailRoutes);
app.use('/', healthRoutes);

mongoose.connect(env.mongo).then(() => {
  app.listen(env.port, () => logger.info('server on '+env.port));
}).catch(e => { logger.error(e); process.exit(1); });