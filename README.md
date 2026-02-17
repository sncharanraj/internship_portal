# 🎓 Internship Application Portal

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)]()
[![Deploy](https://img.shields.io/badge/deploy-Render-blue)]()
[![Frontend](https://img.shields.io/badge/frontend-Vercel-black)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

> A full-stack web application for managing internship applications with automated email notifications and cloud deployment.

## 🌐 Live Demo

- **Frontend:** https://internship-portal-p9lo-sncharanrajs-projects.vercel.app
- **Backend API:** https://internship-portal-tzw8.onrender.com/api
- **Health Check:** https://internship-portal-tzw8.onrender.com/api/health

---

## ✨ Features

### Student Features
- 📝 **Interactive Application Form** - Multi-field form with real-time validation
- ✅ **Input Validation** - Client-side and server-side validation
- 📧 **Email Confirmation** - Instant confirmation email upon submission
- 🔢 **Application ID** - Professional application tracking ID (INT-2026-XXXX)
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

### Admin Features
- 📬 **Email Notifications** - Detailed applicant information via email
- 📊 **Application Statistics** - API endpoints for analytics
- 🔍 **Application Search** - Filter and search capabilities
- 📈 **Status Tracking** - Pending, accepted, rejected status management

### Technical Features
- 🔒 **Security** - Helmet.js, rate limiting, input sanitization
- 🌐 **CORS** - Configured for cross-origin requests
- 💾 **Database** - MongoDB Atlas cloud database
- 📧 **Email Service** - Brevo API for reliable email delivery
- 🚀 **Auto-Deploy** - GitHub Actions CI/CD pipeline
- 📊 **Monitoring** - UptimeRobot for uptime monitoring
- 🐳 **Dockerized** - Ready for containerized deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                    USERS                        │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│   FRONTEND    │           │   BACKEND     │
│   (Vercel)    │◄─────────►│   (Render)    │
│               │   HTTPS   │               │
│  React/Vite   │           │  Node.js      │
│  Tailwind CSS │           │  Express.js   │
└───────────────┘           └───────┬───────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────────┐
            │   MongoDB    │ │  Brevo   │ │    GitHub    │
            │    Atlas     │ │   API    │ │  (CI/CD)     │
            │  (Database)  │ │ (Emails) │ │              │
            └──────────────┘ └──────────┘ └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Hosting:** Vercel

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Email:** Brevo API (@sendinblue/client)
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** express-validator
- **Hosting:** Render

### DevOps
- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Monitoring:** UptimeRobot
- **Deployment:** Automated via GitHub push

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Brevo account (for emails)
- Git installed

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/internship-portal.git
cd internship-portal
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Backend .env configuration:**
```env
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/internship-portal
PORT=5000
NODE_ENV=development
BREVO_API_KEY=xkeysib-YOUR-API-KEY
ADMIN_EMAIL=your-admin@email.com
FRONTEND_URL=http://localhost:3000
```

```bash
# Start backend server
npm start

# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Frontend .env configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account:** https://render.com/
2. **New Web Service** → Connect GitHub repo
3. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: Free

4. **Environment Variables:**
   ```
   MONGODB_URI=your-mongodb-uri
   PORT=10000
   NODE_ENV=production
   BREVO_API_KEY=your-brevo-key
   ADMIN_EMAIL=your-email
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```

5. **Deploy!** Render auto-deploys on every git push.

### Frontend Deployment (Vercel)

1. **Create Vercel Account:** https://vercel.com/
2. **New Project** → Import from GitHub
3. **Configure:**
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```

5. **Deploy!** Vercel auto-deploys on every git push.

---

## 📡 API Documentation

### Base URL
```
Production: https://internship-portal-tzw8.onrender.com/api
Development: http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-02-16T10:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected"
}
```

#### Submit Application
```http
POST /api/applications
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "university": "MIT",
  "degree": "B.Tech",
  "major": "Computer Science",
  "graduationYear": 2026,
  "cgpa": 8.5,
  "preferredDomain": "Web Development",
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeLink": "https://example.com/resume.pdf",
  "githubProfile": "https://github.com/johndoe",
  "linkedinProfile": "https://linkedin.com/in/johndoe",
  "coverLetter": "I am passionate about..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully!",
  "applicationId": "INT-2026-0001"
}
```

#### Get Application Statistics
```http
GET /api/applications/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "pending": 120,
    "accepted": 25,
    "rejected": 5
  }
}
```

#### Get All Applications (Paginated)
```http
GET /api/applications?page=1&limit=20&status=pending
```

**Response:**
```json
{
  "success": true,
  "applications": [...],
  "totalPages": 8,
  "currentPage": 1,
  "total": 150
}
```

---

## 🗄️ Database Schema

### Application Model

```javascript
{
  applicationId: String,        // INT-2026-0001 (auto-generated)
  fullName: String,             // Required
  email: String,                // Required, unique
  phone: String,                // Required, 10 digits
  university: String,           // Required
  degree: String,               // Required
  major: String,                // Required
  graduationYear: Number,       // 2024-2030
  cgpa: Number,                 // 0-10
  preferredDomain: String,      // Enum
  skills: [String],             // Array, min 1
  resumeLink: String,           // Optional, URL
  githubProfile: String,        // Optional, URL
  linkedinProfile: String,      // Optional, URL
  coverLetter: String,          // Optional, max 1000 chars
  status: String,               // pending/accepted/rejected
  submittedAt: Date,            // Auto-generated
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}
```

---

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **Rate Limiting** - 5 applications per hour (production)
- **Input Validation** - express-validator for all inputs
- **CORS** - Configured for specific origins
- **Email Validation** - Brevo sender verification
- **MongoDB Injection Protection** - Mongoose sanitization
- **Environment Variables** - Sensitive data not in code

---

## 📊 Monitoring & Observability

### Uptime Monitoring (UptimeRobot)
- **Backend:** Checks `/api/health` every 5 minutes
- **Frontend:** Checks homepage every 5 minutes
- **Alerts:** Email notifications on downtime

### Logs
- **Render:** Built-in logging dashboard
- **Vercel:** Function logs and analytics
- **MongoDB Atlas:** Database monitoring

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Form validation works
- [ ] All fields accept valid input
- [ ] Error messages display correctly
- [ ] Success message appears after submission
- [ ] Mobile responsive design

**Backend:**
- [ ] Health check endpoint responds
- [ ] Application submission works
- [ ] Duplicate email validation works
- [ ] Rate limiting functions
- [ ] Emails are sent correctly

**Integration:**
- [ ] Frontend connects to backend
- [ ] CORS allows requests
- [ ] Database saves applications
- [ ] Both emails (student & admin) delivered

### API Testing with cURL

```bash
# Health check
curl https://internship-portal-tzw8.onrender.com/api/health

# Submit application
curl -X POST https://internship-portal-tzw8.onrender.com/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "university": "Test University",
    "degree": "B.Tech",
    "major": "Computer Science",
    "graduationYear": 2026,
    "cgpa": 8.0,
    "preferredDomain": "Web Development",
    "skills": ["JavaScript"]
  }'
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Application submission fails with CORS error  
**Solution:** Check `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)

**Issue:** Emails not being sent  
**Solution:** Verify `BREVO_API_KEY` is set correctly and sender email is verified in Brevo

**Issue:** MongoDB connection fails  
**Solution:** Check `MONGODB_URI` is correct and IP whitelist includes `0.0.0.0/0` in Atlas

**Issue:** Frontend shows "Network Error"  
**Solution:** Verify `VITE_API_URL` in Vercel environment variables includes `/api` at end

---

## 📝 Maintenance Guide

### Daily Tasks
- Check UptimeRobot for any downtime alerts
- Review application submissions
- Monitor email delivery in Brevo dashboard

### Weekly Tasks
- Review GitHub Dependabot PRs (security updates)
- Check MongoDB Atlas storage usage
- Review Render and Vercel logs for errors

### Monthly Tasks
- Update npm dependencies
- Review and archive old applications
- Check SSL certificate status (auto-renewed)
- Review free tier limits (MongoDB, Brevo, Render, Vercel)

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| MongoDB Atlas | M0 Free | $0 | 512MB storage |
| Render | Free Tier | $0 | 750 hours/month |
| Vercel | Hobby | $0 | 100GB bandwidth |
| Brevo | Free | $0 | 300 emails/day |
| GitHub Actions | Free | $0 | 2000 min/month |
| UptimeRobot | Free | $0 | 50 monitors |
| **Total** | | **$0/month** | |

**Upgrade Path:** If you exceed free tiers:
- MongoDB Atlas: $9/month (M10)
- Render: $7/month (Starter)
- Vercel: Free is usually enough
- Brevo: $25/month (Lite - 10k emails)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **S N Charanraj** - *Initial work* - [GitHub](https://github.com/sncharanraj)

---

## 🙏 Acknowledgments

- React and Vite documentation
- Express.js community
- MongoDB Atlas team
- Brevo support
- Render and Vercel platforms

---

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**
