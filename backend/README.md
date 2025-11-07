# Backend (Express + TypeScript + Prisma)

Quick start:

1. Copy `.env.example` to `.env` and update values (or use the docker-compose Postgres service):

   cp .env.example .env

2. Install dependencies:

   cd backend
   npm install

3. Generate Prisma client and run migrations:

   npx prisma generate
   npx prisma migrate dev --name init

4. Start dev server:

   npm run dev

API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

All /api/tasks routes require Authorization: Bearer <token>.
