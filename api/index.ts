import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from '../artifacts/api-server/src/lib/logger';
import router from '../artifacts/api-server/src/routes';

// Create Express app
const app = express();

// Middleware
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split('?')[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Routes
app.use('/api', router);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'IPOLIVE API Server' });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve) => {
    app(req as any, res as any);
    res.on('finish', () => resolve());
  });
}
