import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB, { isDbConnected } from './config/db.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/review.js';
import historyRoutes from './routes/history.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: isDbConnected() ? 'connected' : 'disconnected' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or run:`);
    console.error(`  npx kill-port ${PORT}`);
    process.exit(1);
  }
  throw err;
});
