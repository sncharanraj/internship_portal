# 🚀 Deployment Runbook

## Purpose
This runbook provides step-by-step instructions for deploying, monitoring, and maintaining the Internship Portal application.

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing locally
- [ ] No console errors in browser
- [ ] Code reviewed and approved
- [ ] Dependencies updated (no critical vulnerabilities)
- [ ] Environment variables documented

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] CHANGELOG updated
- [ ] Comments added for complex logic

### Testing
- [ ] Manual testing completed
- [ ] Form submissions work
- [ ] Email delivery verified
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done

---

## 🔄 Deployment Process

### Standard Deployment (Git Push)

```bash
# 1. Ensure on main branch
git checkout main
git pull origin main

# 2. Merge your feature branch
git merge feature/your-feature

# 3. Run final tests
cd backend && npm test
cd ../frontend && npm run build

# 4. Commit and push
git add .
git commit -m "Deploy: Description of changes"
git push origin main

# 5. Monitor deployments
# - Render: https://dashboard.render.com/
# - Vercel: https://vercel.com/dashboard
```

**Auto-Deployment Timeline:**
- GitHub Actions: ~2 minutes (CI/CD checks)
- Render Backend: ~30-60 seconds
- Vercel Frontend: ~30-45 seconds

**Total: ~3-4 minutes** from push to live

---

### Hotfix Deployment (Emergency)

For critical bugs in production:

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug-name main

# 2. Make minimal changes to fix issue
# Edit only necessary files

# 3. Test the fix
npm test

# 4. Commit and push
git add .
git commit -m "Hotfix: Brief description"
git push origin hotfix/critical-bug-name

# 5. Merge to main immediately
git checkout main
git merge hotfix/critical-bug-name
git push origin main

# 6. Monitor deployment
# Watch Render/Vercel logs
```

---

### Rollback Procedure

If deployment causes issues:

#### Render (Backend) Rollback

1. Go to Render Dashboard
2. Click your service → **Deployments**
3. Find last working deployment
4. Click **"..."** → **"Redeploy"**
5. Confirm rollback

#### Vercel (Frontend) Rollback

1. Go to Vercel Dashboard  
2. Click project → **Deployments**
3. Find last working deployment
4. Click **"..."** → **"Promote to Production"**
5. Confirm rollback

#### Git Rollback

```bash
# Find commit to rollback to
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main

# Or hard reset (DESTRUCTIVE!)
git reset --hard <commit-hash>
git push --force origin main
```

---

## 🔧 Configuration Management

### Environment Variables

#### Backend (Render)

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `PORT` | Server port | `10000` |
| `NODE_ENV` | Environment | `production` |
| `BREVO_API_KEY` | Email service | `xkeysib-...` |
| `ADMIN_EMAIL` | Admin notifications | `admin@example.com` |
| `FRONTEND_URL` | CORS origin | `https://app.vercel.app` |

**How to Update:**
1. Render Dashboard → Service → Environment
2. Edit variable
3. Click "Save" (auto-redeploys)

#### Frontend (Vercel)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API | `https://api.onrender.com/api` |

**How to Update:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Edit variable
3. Save
4. Go to Deployments → Latest → Redeploy

---

## 📊 Monitoring & Alerts

### Health Checks

**Backend Health:**
```bash
curl https://internship-portal-tzw8.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Frontend Health:**
```bash
curl https://your-frontend.vercel.app
```

Expected: HTML page loads successfully (status 200)

### UptimeRobot Monitoring

**Access:** https://uptimerobot.com/dashboard

**Configured Monitors:**
1. Backend API Health Check
   - URL: `/api/health`
   - Interval: 5 minutes
   - Alert: Email on downtime

2. Frontend Availability
   - URL: Homepage
   - Interval: 5 minutes
   - Alert: Email on downtime

**Response to Downtime Alert:**

1. **Check Service Status**
   - Render: https://status.render.com/
   - Vercel: https://www.vercel-status.com/
   - MongoDB Atlas: https://status.mongodb.com/

2. **Check Logs**
   - Render: Dashboard → Service → Logs
   - Vercel: Dashboard → Project → Functions

3. **Common Issues:**
   - Render free tier: Service sleeps after 15 min inactivity
   - MongoDB: Connection timeout (check IP whitelist)
   - Brevo: API key expired

4. **Escalation:**
   - If issue persists > 15 minutes
   - Check community forums
   - Contact support if needed

---

## 🗄️ Database Operations

### Backup Procedures

**MongoDB Atlas Automatic Backups:**
- Frequency: Every 6 hours
- Retention: 2 days (free tier)
- Location: MongoDB Cloud

**Manual Backup:**
```bash
# Using mongodump (requires MongoDB tools)
mongodump --uri="YOUR_MONGODB_URI" --gzip --archive=backup-$(date +%Y%m%d).gz

# Verify backup
ls -lh backup-*.gz
```

### Restore from Backup

**Via MongoDB Atlas:**
1. Database → Backups
2. Select snapshot
3. Click "Restore"
4. Choose: Download or Restore to Cluster

**Via mongorestore:**
```bash
mongorestore --uri="YOUR_MONGODB_URI" --gzip --archive=backup-20260216.gz
```

### Database Maintenance

**Monthly Tasks:**
- Review indexes (already optimized)
- Check storage usage
- Archive old applications (if needed)

**Commands:**
```javascript
// Check collection stats
db.applications.stats()

// Count documents
db.applications.countDocuments()

// Archive old applications (example)
db.applications.updateMany(
  { submittedAt: { $lt: new Date('2025-01-01') } },
  { $set: { archived: true } }
)
```

---

## 📧 Email Service Management

### Brevo Dashboard

**Access:** https://app.brevo.com/

**Monitor:**
- Emails sent today
- Delivery rate
- Bounce rate
- Spam complaints

**Daily Limits (Free Tier):**
- 300 emails/day
- Upgrade if consistently hitting limit

### Troubleshooting Email Issues

**Emails not sending:**
1. Check Brevo dashboard for errors
2. Verify `BREVO_API_KEY` in Render
3. Check sender email is verified
4. Review Render logs for email errors

**Emails going to spam:**
1. Verify sender domain (use verified email)
2. Add SPF/DKIM records (for custom domains)
3. Keep email content professional
4. Avoid spam trigger words

---

## 🔐 Security Procedures

### Regular Security Checks

**Weekly:**
- [ ] Check Dependabot alerts in GitHub
- [ ] Review Render logs for suspicious activity
- [ ] Monitor failed login attempts (if implemented)

**Monthly:**
- [ ] Update npm dependencies
- [ ] Review CORS settings
- [ ] Check rate limiting effectiveness
- [ ] Rotate API keys (if needed)

### Incident Response

**If Security Breach Detected:**

1. **Immediate Actions:**
   - Disable affected service
   - Rotate all API keys
   - Change database passwords
   - Review logs for extent

2. **Investigation:**
   - Check Render logs
   - Review MongoDB access logs
   - Identify entry point

3. **Remediation:**
   - Patch vulnerability
   - Update dependencies
   - Deploy fix
   - Monitor for repeat

4. **Post-Incident:**
   - Document incident
   - Update security measures
   - Inform affected users (if needed)

---

## 📈 Performance Optimization

### Current Performance Metrics

**Backend:**
- Average response time: 200-300ms
- Health check: < 100ms
- Application submission: 500-800ms

**Frontend:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Bundle Size: ~500KB

### Optimization Checklist

**If performance degrades:**
- [ ] Check MongoDB indexes
- [ ] Review slow query logs
- [ ] Optimize large database queries
- [ ] Enable frontend code splitting (if needed)
- [ ] Add CDN for static assets
- [ ] Implement caching headers

---

## 🧪 Testing in Production

### Smoke Tests (Run After Deployment)

```bash
# 1. Health check
curl https://internship-portal-tzw8.onrender.com/api/health

# 2. Get stats (should work)
curl https://internship-portal-tzw8.onrender.com/api/applications/stats

# 3. Submit test application
curl -X POST https://internship-portal-tzw8.onrender.com/api/applications \
  -H "Content-Type: application/json" \
  -d @test-application.json

# 4. Check email was received

# 5. Verify in MongoDB Atlas
# Database → Browse Collections → applications
```

### Load Testing (Optional)

```bash
# Using Apache Bench
ab -n 100 -c 10 https://internship-portal-tzw8.onrender.com/api/health

# Expected: 100% success rate, < 500ms avg response
```

---

## 📞 Escalation Contacts

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| Critical Downtime | Team Lead | 15 minutes |
| Security Incident | Security Team | 1 hour |
| Database Issues | DBA / MongoDB Support | 4 hours |
| Email Delivery | Brevo Support | 24 hours |
| Infrastructure | Render/Vercel Support | 24-48 hours |

---

## 📝 Change Log Template

When making changes, update CHANGELOG.md:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified feature description

### Fixed
- Bug fix description

### Security
- Security update description
```

---

## ✅ Post-Deployment Verification

After every deployment:

- [ ] Health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] Test application submission works
- [ ] Emails are delivered
- [ ] No errors in Render logs
- [ ] No errors in Vercel logs
- [ ] UptimeRobot shows green
- [ ] MongoDB connection stable

---

**Keep this runbook updated as the system evolves!**

Last Updated: February 16, 2026
