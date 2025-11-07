FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY . .
RUN npm run prisma:generate || true
CMD ["node", "dist/index.js"]
