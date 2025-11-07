import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export default function (prisma: PrismaClient) {
  const router = Router();

  router.post('/register', async (req, res) => {
    try {
      const parsed = registerSchema.parse(req.body);
      const existing = await prisma.user.findUnique({ where: { username: parsed.username } });
      if (existing) return res.status(400).json({ error: 'Username already taken' });
      const hashed = await bcrypt.hash(parsed.password, 10);
      const user = await prisma.user.create({ data: { username: parsed.username, password: hashed } });
      res.json({ id: user.id, username: user.username });
    } catch (err: any) {
      if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const parsed = loginSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { username: parsed.username } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(parsed.password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ token });
    } catch (err: any) {
      if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}
