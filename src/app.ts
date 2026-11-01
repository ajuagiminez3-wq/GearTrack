import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/gear.routes';
import { BadRequest } from './utils/validation';

const app = express();
app.use(helmet());
app.use(cors()); // Development only: restrict origins before public deployment.
app.use(express.json());
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api', router);
app.use((_req, res) => { res.status(404).json({ message: 'Route not found.' }); });

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof BadRequest) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_NO_REFERENCED_ROW_2') {
    res.status(400).json({ message: 'Invalid categoryId.' });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'Invalid JSON request body.' });
    return;
  }
  console.error('API error:', error);
  res.status(500).json({ message: 'Unexpected server or database error.' });
};
app.use(errorHandler);

export default app;
