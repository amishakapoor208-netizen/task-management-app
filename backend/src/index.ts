import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';

dotenv.config();

const execAsync = promisify(exec);

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter(prisma));
app.use('/api/tasks', tasksRouter(prisma));

const port = process.env.PORT || 4000;

// Run migrations on startup (for Render free tier)
async function startServer() {
  try {
    console.log('Running database migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // Continue anyway - migrations might already be applied
  }
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
