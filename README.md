# 🎓 Internship Application Portal

A full-stack web application for managing internship applications with email notifications and a clean, interactive UI.

## 📋 Features

- ✅ **Interactive Form** - Clean, modern UI built with React & Tailwind CSS
- 📧 **Email Notifications** - Automatic emails to students and admin
- 💾 **Database Storage** - MongoDB for scalable data storage
- 🔒 **Validation** - Both client-side and server-side validation
- 🚀 **Scalable** - Handles 1,000 to 100,000+ applications
- 💰 **100% Free Tools** - All services used are free tier

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Nodemailer** - Email service
- **Express Validator** - Input validation
- **Helmet** - Security
- **Rate Limiting** - DDoS protection

## 📁 Project Structure

```
internship-portal/
├── backend/
│   ├── models/
│   │   └── Application.js
│   ├── services/
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Gmail account for sending emails

### 1. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string

### 2. Gmail Setup (for sending emails)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate an app password for "Mail"
5. Save this password for later

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# - MONGODB_URI (from MongoDB Atlas)
# - EMAIL_USER (your Gmail)
# - EMAIL_PASS (app password from Gmail)
# - ADMIN_EMAIL (where you want to receive notifications)

# Start the server
npm start

# For development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default API URL is already set to http://localhost:5000/api
# Change this if your backend runs on a different port

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🌐 Deployment (Free Options)

### Backend Deployment - Railway.app (Free)

1. Create account on [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables in Railway dashboard:
   - `MONGODB_URI`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ADMIN_EMAIL`
   - `FRONTEND_URL` (will be your Vercel URL)
   - `NODE_ENV=production`
5. Railway will auto-deploy your backend

**Alternative:** Render.com (also free)

### Frontend Deployment - Vercel (Free)

1. Create account on [Vercel](https://vercel.com)
2. Click "New Project" → Import your repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL=https://your-railway-app.railway.app/api`
5. Deploy!

**Alternative:** Netlify (also free)

## 📧 Email Configuration

The system sends two types of emails:

1. **Student Email** - Confirmation of application submission
2. **Admin Email** - Detailed application information

Make sure to:
- Use a valid Gmail account
- Generate an App Password (not your regular password)
- Check spam folder initially

## 🔐 Security Features

- ✅ Rate limiting (5 applications per hour per IP)
- ✅ Input validation and sanitization
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Email validation
- ✅ Phone number validation
- ✅ Duplicate application prevention

## 📊 API Endpoints

### POST /api/applications
Submit a new application

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "university": "Stanford University",
  "degree": "B.Tech",
  "major": "Computer Science",
  "graduationYear": 2025,
  "cgpa": 8.5,
  "preferredDomain": "Web Development",
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeLink": "https://drive.google.com/...",
  "githubProfile": "https://github.com/johndoe",
  "linkedinProfile": "https://linkedin.com/in/johndoe",
  "coverLetter": "I am passionate about..."
}
```

### GET /api/applications/stats
Get application statistics (total, pending, accepted, rejected)

### GET /api/applications
Get all applications with pagination

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: pending, accepted, rejected)

### GET /api/health
Health check endpoint

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:5000/api/health
```

### Test Frontend
Open browser: `http://localhost:3000`

### Test Email
Submit a test application and check:
1. Your email inbox (student confirmation)
2. Admin email inbox (application details)

## 📈 Scaling for 100,000+ Applications

This architecture is designed to scale:

- **MongoDB Atlas** - Can handle millions of documents
- **Indexing** - Optimized queries with email and date indexes
- **Rate Limiting** - Prevents abuse and DDoS
- **Pagination** - Efficient data loading
- **Async Operations** - Non-blocking email sending

For extreme scale:
- Upgrade to paid MongoDB tier
- Add Redis for caching
- Use message queue (RabbitMQ/Redis) for email processing
- Deploy multiple backend instances with load balancer

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify network connection

### "Email not sending"
- Verify Gmail App Password is correct
- Check if 2FA is enabled
- Look for errors in server console
- Check spam folder

### "CORS Error"
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- In development: should be `http://localhost:3000`
- In production: should be your Vercel URL

### "Port already in use"
- Change PORT in `.env` file
- Kill the process using the port: `kill -9 $(lsof -ti:5000)`

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📄 License

MIT License - feel free to use this for your own projects!

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ for efficient internship management**
