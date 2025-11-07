import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRouter from '../routes/auth';
import tasksRouter from '../routes/tasks';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api/auth', authRouter(prisma));
app.use('/api/tasks', tasksRouter(prisma));

describe('Auth API', () => {
  beforeAll(async () => {
    // Clean up test user if exists
    await prisma.user.deleteMany({ where: { username: 'testuser' } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'testuser' } });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('testuser');
    });

    it('should reject duplicate username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'ab', password: '123' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
    });
  });
});

describe('Tasks API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user and get token
    await prisma.user.deleteMany({ where: { username: 'taskuser' } });
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'taskuser', password: 'password123' });
    
    userId = registerRes.body.id;
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'taskuser', password: 'password123' });
    
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { username: 'taskuser' } });
    await prisma.$disconnect();
  });

  describe('GET /api/tasks', () => {
    it('should require authentication', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
    });

    it('should return tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task', description: 'Test description' });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Task');
      expect(response.body).toHaveProperty('id');
    });

    it('should validate task input', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const task = await prisma.task.create({
        data: { title: 'Update Test', userId }
      });
      taskId = task.id;
    });

    it('should update a task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
    });

    it('should not update another user\'s task', async () => {
      // Create another user
      await prisma.user.create({
        data: { username: 'otheruser', password: 'pass' }
      });
      const otherTask = await prisma.task.create({
        data: { title: 'Other task', userId: 'other-user-id' }
      });

      const response = await request(app)
        .put(`/api/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });
      
      expect(response.status).toBe(404);
      
      await prisma.task.delete({ where: { id: otherTask.id } });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await prisma.task.create({
        data: { title: 'Delete Test', userId }
      });
      taskId = task.id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });
});
