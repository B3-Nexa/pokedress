import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve raw item photos statically
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// If running as standalone server
if (process.env.NODE_ENV !== 'test') {
  connectDatabase()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`PokeDress Backend running on port ${config.port}`);
      });
    })
    .catch((err) => {
      console.warn('MongoDB connection failed on start:', err.message);
      app.listen(config.port, () => {
        console.log(`PokeDress Backend started without MongoDB on port ${config.port}`);
      });
    });
}
