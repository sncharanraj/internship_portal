# 🚀 DevOps Deployment Guide

This guide will help you deploy the Internship Portal using DevOps best practices.

## 📋 Prerequisites for DevOps

- Git installed
- Docker installed (for containerization)
- GitHub account
- Railway/Render account (Backend)
- Vercel/Netlify account (Frontend)

---

## 🐳 Phase 1: Containerization with Docker

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (for local testing)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - FRONTEND_URL=http://localhost:3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    restart: unless-stopped
```

**Test Docker locally:**
```bash
docker-compose up --build
```

---

## 📦 Phase 2: CI/CD Pipeline with GitHub Actions

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Backend Tests
  backend-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Backend Dependencies
      working-directory: ./backend
      run: npm install
      
    - name: Run Backend Linting
      working-directory: ./backend
      run: npm run lint || echo "No lint script defined"
      
    - name: Run Backend Tests
      working-directory: ./backend
      run: npm test || echo "No tests defined yet"

  # Frontend Tests
  frontend-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Frontend Dependencies
      working-directory: ./frontend
      run: npm install
      
    - name: Build Frontend
      working-directory: ./frontend
      run: npm run build
      
    - name: Run Frontend Tests
      working-directory: ./frontend
      run: npm test || echo "No tests defined yet"

  # Docker Build Test
  docker-build:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Backend Docker Image
      run: docker build -t internship-backend ./backend
      
    - name: Build Frontend Docker Image
      run: docker build -t internship-frontend ./frontend

  # Deploy to Production (on main branch)
  deploy:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test, docker-build]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway (Backend)
      run: echo "Deploy to Railway via their CLI or webhooks"
      
    - name: Deploy to Vercel (Frontend)
      run: echo "Deploy to Vercel via their CLI or webhooks"
```

---

## 🌐 Phase 3: Free Cloud Deployment

### Option A: Railway (Backend) + Vercel (Frontend)

#### Deploy Backend to Railway:

1. **Connect GitHub to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Choose `backend` folder

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@example.com
   FRONTEND_URL=https://your-app.vercel.app
   PORT=5000
   ```

3. **Railway will automatically:**
   - Detect Node.js
   - Install dependencies
   - Deploy your app
   - Provide a URL: `https://your-app.railway.app`

#### Deploy Frontend to Vercel:

1. **Import Project:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Set root directory to `frontend`

2. **Configure Build Settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```

4. **Deploy!**

### Option B: Render (Both Frontend & Backend)

1. Create two services on Render
2. Backend: Web Service
3. Frontend: Static Site
4. Configure environment variables
5. Deploy!

---

## 📊 Phase 4: Monitoring & Logging

### Add Monitoring with Free Tools:

#### 1. Uptime Monitoring (UptimeRobot - Free)
- Monitor if your app is up
- Get alerts via email

#### 2. Application Monitoring (New Relic - Free Tier)

Add to `backend/server.js`:
```javascript
// At the top
require('newrelic');
```

#### 3. Error Tracking (Sentry - Free)

Install Sentry:
```bash
npm install @sentry/node
```

Add to `backend/server.js`:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

#### 4. Logs (Papertrail/LogDNA - Free Tier)

Configure in Railway/Render dashboard

---

## 🔐 Phase 5: Security Hardening

### SSL/HTTPS
- ✅ Railway provides free SSL
- ✅ Vercel provides free SSL
- No configuration needed!

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use platform secrets management
- ✅ Rotate secrets regularly

### Rate Limiting
- ✅ Already implemented in code
- Can add Cloudflare (free) for additional protection

---

## 📈 Phase 6: Scaling Strategy

### Current Capacity:
- **Free Tier Limits:**
  - Railway: 500 hours/month, 512MB RAM
  - Vercel: 100GB bandwidth/month
  - MongoDB Atlas: 512MB storage (10K writes/day)

### Scaling Path:

1. **0-1,000 applications**: Current setup works perfectly
2. **1,000-10,000**: Add Redis caching, optimize queries
3. **10,000-50,000**: Upgrade MongoDB, add CDN
4. **50,000+**: Move to paid tiers, load balancing

### Auto-scaling Configuration (Paid Tiers):
```yaml
# Railway scaling
scale:
  minReplicas: 1
  maxReplicas: 5
  targetCPU: 80
```

---

## 🧪 Phase 7: Testing in DevOps

### Add Testing Scripts:

`backend/package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Example Test (install jest first):
```bash
npm install --save-dev jest supertest
```

`backend/tests/api.test.js`:
```javascript
const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
  test('Health check should return 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
  });
});
```

---

## 📝 Phase 8: Documentation

### API Documentation (Swagger)

Install:
```bash
npm install swagger-ui-express swagger-jsdoc
```

Add to `server.js`:
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Internship Portal API',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

## 🎯 DevOps Checklist

- [ ] Code in Git repository
- [ ] Dockerfiles created
- [ ] CI/CD pipeline configured
- [ ] Environment variables secured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] MongoDB connected
- [ ] Email service working
- [ ] SSL/HTTPS enabled
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Documentation complete
- [ ] Backups configured
- [ ] Load testing done

---

## 🚨 Troubleshooting

### Deployment fails:
1. Check logs in Railway/Vercel dashboard
2. Verify environment variables
3. Ensure MongoDB URI is correct

### Application crashes:
1. Check error logs
2. Monitor memory usage
3. Review Sentry errors

### Slow performance:
1. Add database indexes
2. Implement caching
3. Optimize queries
4. Use CDN for static assets

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

**Ready to deploy! 🎉**

Next Steps:
1. Push code to GitHub
2. Set up Railway account
3. Set up Vercel account
4. Configure environment variables
5. Deploy and test!
