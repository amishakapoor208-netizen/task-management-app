import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional()
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional()
});

export default function (prisma: PrismaClient) {
  const router = Router();
  router.use(requireAuth);

  router.get('/', async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  });

  router.post('/', async (req: AuthRequest, res) => {
    try {
      const parsed = createSchema.parse(req.body);
      const userId = req.userId!;
      const task = await prisma.task.create({ data: { ...parsed, userId } });
      res.json(task);
    } catch (err: any) {
      if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.put('/:id', async (req: AuthRequest, res) => {
    try {
      const parsed = updateSchema.parse(req.body);
      const userId = req.userId!;
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task || task.userId !== userId) return res.status(404).json({ error: 'Not found' });
      const updated = await prisma.task.update({ where: { id: req.params.id }, data: parsed });
      res.json(updated);
    } catch (err: any) {
      if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.delete('/:id', async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task || task.userId !== userId) return res.status(404).json({ error: 'Not found' });
      await prisma.task.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}
