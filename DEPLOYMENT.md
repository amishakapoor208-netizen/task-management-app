# 🚀 Deployment Guide

## Quick Deployment Checklist

### ✅ Pre-Deployment Requirements
- [x] Backend API working
- [x] Frontend UI working
- [x] Database configured
- [x] Authentication working
- [x] Tests passing
- [x] Docker files created
- [x] Environment variables documented
- [x] .gitignore created
- [x] README documentation complete

---

## 🌐 Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier)

#### Backend Deployment:
1. Push code to GitHub
2. Go to [Render.com](https://render.com) and sign up
3. Create new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Environment Variables**:
     ```
     DATABASE_URL=postgresql://user:pass@host:5432/dbname
     JWT_SECRET=your_strong_secret_key_here
     PORT=4000
     NODE_ENV=production
     ```
6. Click "Create Web Service"

#### Frontend Deployment:
1. Update `frontend/.env` with your backend URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
2. Create new "Static Site" on Render
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click "Create Static Site"

---

### Option 2: Deploy to Railway

#### Backend:
1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Add PostgreSQL database
4. Deploy from GitHub repository
5. Set environment variables (same as above)

#### Frontend:
1. Build locally: `cd frontend && npm run build`
2. Deploy `dist` folder to Vercel/Netlify/Railway

---

### Option 3: Deploy to Vercel + PlanetScale

#### Backend:
1. Deploy to Vercel:
   ```bash
   cd backend
   vercel
   ```
2. Add PostgreSQL from [PlanetScale](https://planetscale.com)

#### Frontend:
1. Deploy to Vercel:
   ```bash
   cd frontend
   vercel
   ```

---

### Option 4: Docker Deployment (VPS/Cloud)

#### Full Stack with Docker Compose:
```bash
# 1. Update docker-compose.yml with production settings
# 2. Build and run:
docker-compose up -d --build

# 3. Check logs:
docker-compose logs -f
```

#### Individual Docker Builds:
```bash
# Backend:
cd backend
docker build -t taskapp-backend .
docker run -p 4000:4000 -e DATABASE_URL="..." -e JWT_SECRET="..." taskapp-backend

# Frontend:
cd frontend
docker build -t taskapp-frontend .
docker run -p 80:80 taskapp-frontend
```

---

## 🔐 Environment Variables

### Backend (.env):
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_very_strong_secret_key_minimum_32_characters
PORT=4000
NODE_ENV=production
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 📊 Database Setup (Production)

### PostgreSQL on Render:
1. Create PostgreSQL database on Render
2. Copy the "Internal Database URL"
3. Add to backend environment variables as `DATABASE_URL`
4. Prisma will auto-migrate on first deploy

### Run migrations manually:
```bash
cd backend
npx prisma migrate deploy
```

---

## 🧪 Pre-Deployment Testing

Run these commands before deploying:

```bash
# Backend tests:
cd backend
npm test

# Frontend build test:
cd frontend
npm run build

# Check if build works:
npx serve dist
```

---

## 🔄 CI/CD Setup (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📱 Quick Deploy Commands

### Deploy to Render (one-click):
```bash
# Install Render CLI
npm install -g render-cli

# Deploy
render deploy
```

### Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Backend
cd backend && vercel

# Frontend
cd frontend && vercel
```

---

## 🎯 Post-Deployment Checklist

- [ ] Backend API accessible (test with curl)
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Can create/update/delete tasks
- [ ] Authentication working
- [ ] Database persisting data
- [ ] HTTPS enabled (provided by hosting platform)
- [ ] CORS configured correctly
- [ ] Environment variables set

---

## 🐛 Troubleshooting

### Backend won't start:
- Check DATABASE_URL is correct
- Ensure PORT is not in use
- Verify JWT_SECRET is set
- Check logs: `docker-compose logs backend`

### Frontend can't connect to backend:
- Update VITE_API_URL in frontend/.env
- Rebuild frontend: `npm run build`
- Check CORS settings in backend

### Database errors:
- Run migrations: `npx prisma migrate deploy`
- Reset database: `npx prisma migrate reset`
- Check connection string format

---

## 📞 Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints manually
4. Review deployment platform docs

---

## 🎉 Success!

Your task management app is now deployed and accessible worldwide! 🌍

**Example URLs:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.onrender.com
