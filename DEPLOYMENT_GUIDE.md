# 🚀 Deployment Guide - Medusa v2 + Razorpay

**Date:** July 16, 2026  
**Status:** Ready for Deployment  
**Target Environment:** Production

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- ✅ All payment flow improvements implemented
- ✅ Order cancellation feature implemented
- ✅ User-friendly error messages added
- ✅ Customer-friendly status labels configured
- ✅ Enhanced logging throughout
- ✅ 404 race condition fixed
- ✅ Development environment tested
- ✅ Code quality verified

### ⏳ Required Before Deployment
- [ ] Manual UI testing completed (see TEST_EXECUTION_REPORT.md)
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Production environment configured
- [ ] Production Razorpay keys obtained
- [ ] Database backup completed
- [ ] SSL certificates verified

---

## 🔧 Environment Configuration

### 1. Backend Environment Variables

**File:** `medusa-backend/apps/backend/.env.production`

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/production_db

# Redis (for sessions and caching)
REDIS_URL=redis://your-redis-host:6379

# Razorpay - PRODUCTION KEYS
RAZORPAY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_key

# Medusa
MEDUSA_BACKEND_URL=https://api.yourdomain.com
ADMIN_CORS=https://admin.yourdomain.com,https://yourdomain.com
STORE_CORS=https://yourdomain.com

# JWT Secret (generate new for production)
JWT_SECRET=your_production_jwt_secret_min_32_chars

# Cookie Secret (generate new for production)
COOKIE_SECRET=your_production_cookie_secret_min_32_chars
```

**Important:**
- ⚠️ Never commit `.env.production` to git
- ⚠️ Use strong, randomly generated secrets
- ⚠️ Verify Razorpay keys are LIVE keys (rzp_live_)
- ⚠️ Ensure database is production-ready with backups

### 2. Frontend Environment Variables

**File:** `solace-medusa-starter/.env.production`

```bash
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Razorpay - PRODUCTION KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX

# Optional: Analytics, Error Tracking
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Store Info
NEXT_PUBLIC_SHOP_NAME=Your Store Name
NEXT_PUBLIC_SHOP_DESCRIPTION=Complete your order
```

**Important:**
- ⚠️ Only use NEXT_PUBLIC_ for variables needed in browser
- ⚠️ Verify backend URL is accessible from frontend
- ⚠️ Test API connectivity before deployment

### 3. Razorpay Dashboard Configuration

**Login:** https://dashboard.razorpay.com

**Steps:**
1. Switch from Test Mode to Live Mode
2. Navigate to Settings → API Keys
3. Generate Live API Keys
4. Copy Key ID and Secret
5. Navigate to Settings → Webhooks (for future)
6. Configure webhook URLs (when implementing webhooks)
7. Enable required payment methods:
   - Cards (Visa, Mastercard, etc.)
   - UPI
   - Net Banking
   - Wallets
8. Verify settlement account is active
9. Set auto-capture to enabled (if not already)

---

## 🏗️ Build Process

### Backend Build

```bash
cd medusa-backend/apps/backend

# Install dependencies
npm install

# Build the application
npm run build

# Database migrations (if any)
npx medusa migrations run

# Verify build
npm run start
```

### Frontend Build

```bash
cd solace-medusa-starter

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run start

# Verify at http://localhost:3000
```

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails:**
- Check for TypeScript errors
- Verify all environment variables set
- Review build logs for specific errors
- Ensure all dependencies installed

---

## 🐳 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd solace-medusa-starter
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set environment variables in Vercel dashboard
# - Deploy

# Production deployment
vercel --prod
```

**Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Add all NEXT_PUBLIC_ variables
3. Set production domain
4. Enable automatic deployments from git

#### Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd medusa-backend/apps/backend
railway init

# Add environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set RAZORPAY_ID=rzp_live_...
# ... add all variables

# Deploy
railway up
```

### Option 2: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: medusa
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: medusa_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./medusa-backend/apps/backend
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: postgresql://medusa:medusa_password@postgres:5432/medusa
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./solace-medusa-starter
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://backend:9000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Option 3: VPS Deployment (Ubuntu)

```bash
# SSH into VPS
ssh user@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server

# Install Nginx
sudo apt-get install nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/medusa-store.git
cd medusa-store

# Backend setup
cd medusa-backend/apps/backend
npm install
npm run build

# Start with PM2
pm2 start npm --name "medusa-backend" -- run start

# Frontend setup
cd ../../solace-medusa-starter
npm install
npm run build

# Start with PM2
pm2 start npm --name "medusa-frontend" -- run start

# Save PM2 processes
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
# Backend (API)
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**SSL with Certbot:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔍 Post-Deployment Verification

### 1. Smoke Tests

```bash
# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com

# Test API connectivity
curl https://api.yourdomain.com/store/products
```

### 2. First Transaction Test

**Critical: Test with REAL payment**

1. Visit your store
2. Add item to cart
3. Complete checkout with SMALL amount
4. Use your own payment method
5. Verify:
   - Payment successful
   - Order created
   - Email received (if configured)
   - Order visible in admin
   - Payment shows in Razorpay dashboard

### 3. Monitor First Hour

**Watch for:**
- Any errors in logs
- Payment success rate
- Order creation rate
- Customer complaints
- Support tickets

**Monitoring Tools:**
```bash
# Backend logs (PM2)
pm2 logs medusa-backend

# Frontend logs (PM2)
pm2 logs medusa-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Monitoring & Logging

### Application Logs

**Backend Logs:**
- Look for `[Razorpay]` prefixed messages
- Monitor payment success/failure rates
- Track order creation errors

**Frontend Logs:**
- Browser console errors (check with real users)
- Network failures
- Payment modal issues

### Razorpay Dashboard Monitoring

**Daily Checks:**
1. Log in to https://dashboard.razorpay.com
2. Check Transactions → Recent payments
3. Verify all payments captured
4. Monitor failed/pending payments
5. Check settlements status
6. Review any disputes

### Database Monitoring

**Important Queries:**

```sql
-- Check recent orders
SELECT id, display_id, status, created_at 
FROM "order" 
ORDER BY created_at DESC 
LIMIT 10;

-- Check payment status
SELECT o.display_id, pc.status as payment_status 
FROM "order" o
JOIN payment_collection pc ON o.payment_collection_id = pc.id
ORDER BY o.created_at DESC;

-- Check cancelled orders
SELECT id, display_id, status, canceled_at 
FROM "order" 
WHERE status = 'canceled'
ORDER BY canceled_at DESC;
```

### Error Tracking (Optional but Recommended)

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

**Configure:**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🚨 Rollback Plan

### If Critical Issues Occur

**Immediate Actions:**
1. Assess severity of issue
2. If payments affected: Consider temporary maintenance mode
3. Check logs for error patterns
4. Contact Razorpay support if payment issues

**Rollback Steps:**

```bash
# Vercel
vercel rollback [deployment-url]

# Railway
railway rollback

# PM2
pm2 stop medusa-backend
pm2 stop medusa-frontend
cd medusa-backend/apps/backend
git checkout [previous-commit]
npm install
npm run build
pm2 restart medusa-backend

# Same for frontend
```

**Communication:**
- Update status page if you have one
- Email customers if needed
- Post on social media
- Brief support team

---

## 📞 Support & Troubleshooting

### Common Issues

#### 1. "Payment succeeded but no order created"

**Diagnosis:**
```bash
# Check backend logs
grep "Razorpay" backend.log | grep "payment successful"

# Check Razorpay dashboard for payment ID
# Verify in database
```

**Resolution:**
- Manually create order for customer
- Process order with payment ID
- Note: This will be fixed when webhooks are implemented

#### 2. "Database connection failed"

**Diagnosis:**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
pm2 logs medusa-backend | grep "database"
```

**Resolution:**
- Verify DATABASE_URL is correct
- Check database server is running
- Verify firewall rules allow connection
- Check connection pool limits

#### 3. "Razorpay modal not opening"

**Diagnosis:**
- Check browser console for errors
- Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Test Razorpay script loading

**Resolution:**
- Verify environment variable in frontend
- Check for CSP (Content Security Policy) issues
- Clear browser cache
- Try different browser

### Emergency Contacts

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: +91-80-61163333
- Dashboard: Live chat available

**Medusa Support:**
- Discord: https://discord.gg/medusajs
- Docs: https://docs.medusajs.com
- GitHub: https://github.com/medusajs/medusa

---

## 📈 Performance Optimization (Post-Launch)

### Backend Optimization

```bash
# Enable Redis caching
# Already configured in Medusa

# Database indexing
CREATE INDEX idx_order_created_at ON "order"(created_at);
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_payment_status ON payment_collection(status);

# Connection pooling
# Configure in DATABASE_URL
```

### Frontend Optimization

**Next.js Config:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

**CDN Integration:**
- Use Vercel Edge Network (automatic)
- Or configure Cloudflare
- Or use AWS CloudFront

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All manual tests passed
- [ ] Production environment configured
- [ ] Database backup completed
- [ ] Razorpay live keys obtained
- [ ] DNS records configured
- [ ] SSL certificates ready
- [ ] Team briefed on new features

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrations run
- [ ] Environment variables verified
- [ ] Health checks passing
- [ ] First test transaction successful

### Post-Deployment
- [ ] Monitoring active
- [ ] Error tracking configured
- [ ] Support team ready
- [ ] Documentation updated
- [ ] Rollback plan ready
- [ ] First hour monitoring completed

### First Week
- [ ] Daily metrics review
- [ ] Payment success rate > 95%
- [ ] No critical bugs reported
- [ ] Customer feedback positive
- [ ] Support tickets minimal

---

## 🎯 Success Metrics

**Key Performance Indicators:**

| Metric | Target | Status |
|--------|--------|--------|
| Payment Success Rate | > 95% | Monitor |
| Payment Processing Time | < 30s | Monitor |
| Order Creation Success | > 99% | Monitor |
| API Response Time | < 500ms | Monitor |
| Support Tickets (Payment) | < 1% of orders | Monitor |
| Customer Satisfaction | > 4.5/5 | Monitor |

**Tools for Tracking:**
- Razorpay Dashboard
- Google Analytics
- Custom logging dashboard
- Support ticket system

---

## 🔮 Future Improvements

**Phase 2 (Planned):**
- [ ] Implement webhook handlers
- [ ] Add automatic refund processing
- [ ] Implement email notifications
- [ ] Add SMS order updates
- [ ] Enhanced analytics dashboard

**Phase 3 (Future):**
- [ ] Multi-currency support
- [ ] Subscription payments
- [ ] Split payments
- [ ] Advanced fraud detection
- [ ] Customer loyalty program

---

## 📚 Additional Resources

**Documentation:**
- [Medusa v2 Docs](https://docs.medusajs.com)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

**Project Documentation:**
- `RAZORPAY_PAYMENT_FLOW_AUDIT_REPORT.md`
- `RAZORPAY_REFUND_FLOW_AUDIT_REPORT.md`
- `ORDER_CANCELLATION_FEATURE_DOCUMENTATION.md`
- `IMPLEMENTATION_SUMMARY.md`
- `TESTING_AND_DEPLOYMENT_CHECKLIST.md`

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** July 16, 2026

**Deployed By:** _____________

**Deployment Date:** _____________

**Production URL:** _____________

---

*Good luck with your deployment! 🚀*
