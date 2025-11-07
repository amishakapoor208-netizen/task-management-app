# Task Management Application

A full-stack task management application where users can register, login, and manage their tasks with JWT authentication.

## Technology Stack

### Frontend
- React (Vite)
- TypeScript
- TailwindCSS
- Redux Toolkit
- Axios
- React Hook Form
- Zod

### Backend
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT for authentication

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Each user can only access their own tasks
- Secure password hashing
- Protected API routes

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd New-Project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:

Create `backend/.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskapp
JWT_SECRET=your_secret_key_here
PORT=4000
```

5. Setup database:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

6. Run the application:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

7. Open http://localhost:5173 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Project Structure

```
New-Project/
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── store/          # Redux store
│   │   └── services/       # API services
│   └── package.json
└── README.md
```
