// Load environment variables from .env file FIRST
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDatabase } from './database/config';
import { seedProducts } from './database/seeders/seed';
import { validateAppEnv } from './utils/env';
import './models'; // Initialize models and associations

// Validate environment variables before starting
validateAppEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and seed data
(async () => {
  try {
    await connectDatabase();
    await seedProducts();
    
    // Routes
    app.use('/api', routes);

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', message: 'Commerce API is running' });
    });

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((err: any, req: Request, res: Response, next: any) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});
