import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import { logger } from './utils/logger.js';

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
async function startServer() {
  try {
    await mongoose.connect(env.mongo);
    const basePort = Number(env.port) || 3000;
    let port = basePort;

    const startListening = (port: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const server = app
          .listen(port, () => {
            const pid = process.pid;
            console.log(`✅ bkeepit backend live on port ${port} (PID: ${pid})`);
            logger.info(`Server ready on port ${port} [PID ${pid}]`);
            resolve(port);

            // Graceful shutdown
            process.on('SIGINT', async () => {
              console.log('\n🧹 Shutting down gracefully...');
              await mongoose.connection.close();
              server.close(() => {
                console.log('🛑 Server stopped.');
                process.exit(0);
              });
            });
          })
          .on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') reject(err);
            else throw err;
          });
      });
    };

    // Attempt startup with fallback
    try {
      await startListening(port);
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        const fallback = port + 1;
        console.warn(`⚠️ Port ${port} in use, retrying on ${fallback}...`);
        await startListening(fallback);
      } else {
        throw err;
      }
    }
  } catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  logger.error(`❌ MongoDB connection failed: ${message}`);
  process.exit(1);
}

}

startServer();
