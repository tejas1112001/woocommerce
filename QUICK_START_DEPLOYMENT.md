# 🚀 Quick Start Deployment Guide

**For:** Rapid production deployment  
**Time Required:** 30-60 minutes  
**Difficulty:** Intermediate

---

## ⚡ TL;DR - Deploy in 5 Steps

1. **Test Manually** → Complete browser testing
2. **Get Razorpay Live Keys** → Switch from test to live mode
3. **Configure Environment** → Set production variables
4. **Deploy** → Use Vercel + Railway (easiest)
5. **Verify** → Test with real payment

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Completed manual browser testing
- [ ] Razorpay account verified
- [ ] Production database ready (PostgreSQL)
- [ ] Domain name registered
- [ ] Credit card for platform fees (Vercel/Railway)
- [ ] 1-2 hours of time

---

## 🔑 Step 1: Get Razorpay Live Keys (5 mins)

1. Go to https://dashboard.razorpay.com
2. Click **Test Mode** → Switch to **Live Mode**
3. Navigate to **Settings** → **API Keys**
4. Click **Generate Live Key**
5. **IMPORTANT:** Copy and save:
   - Key ID (starts with `rzp_live_`)
   - Key Secret (shown only once!)

**Security Warning:** Never commit these keys to git!

---

## 🗄️ Step 2: Prepare Database (10 mins)

### Option A: Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql

# Copy DATABASE_URL from Railway dashboard
```

### Option B: Your Own PostgreSQL

Ensure you have:
- PostgreSQL 13+ running
- Database created
- Connection URL ready: `postgresql://user:pass@host:5432/dbname`

---

## ⚙️ Step 3: Configure Environment (10 mins)

### Backend Environment Variables

Create `medusa-backend/apps/backend/.env.production`:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/production_db

# Redis (Railway provides this, or use your own)
REDIS_URL=redis://your-redis-url:6379

# Razorpay LIVE Keys
RAZORPAY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_key

# URLs (update after deployment)
MEDUSA_BACKEND_URL=https://your-backend.up.railway.app
ADMIN_CORS=https://your-backend.up.railway.app,https://your-store.vercel.app
STORE_CORS=https://your-store.vercel.app

# Secrets (generate random strings)
JWT_SECRET=your_random_jwt_secret_min_32_characters
COOKIE_SECRET=your_random_cookie_secret_min_32_characters
```

**Generate Secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate COOKIE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables

For Vercel deployment, you'll add these via dashboard:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
NEXT_PUBLIC_SHOP_NAME=Your Store Name
```

---

## 🚂 Step 4A: Deploy Backend to Railway (10 mins)

```bash
# Navigate to backend
cd medusa-backend/apps/backend

# Login to Railway
railway login

# Create project (if not done already)
railway init

# Link to project
railway link

# Add environment variables via Railway dashboard
# Or use CLI:
railway variables set RAZORPAY_ID=rzp_live_XXXXX
railway variables set RAZORPAY_KEY_SECRET=your_secret
railway variables set JWT_SECRET=your_jwt_secret
railway variables set COOKIE_SECRET=your_cookie_secret
# ... add all variables

# Deploy
railway up

# Note the deployment URL (e.g., https://your-app.up.railway.app)
```

**After Deployment:**
1. Go to Railway dashboard
2. Find your deployment URL
3. Test: `curl https://your-backend.up.railway.app/health`

---

## ▲ Step 4B: Deploy Frontend to Vercel (10 mins)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd solace-medusa-starter

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Will ask:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? your-store
# - Directory? ./
# - Override settings? No
```

**Add Environment Variables:**

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL = https://your-backend.up.railway.app
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_XXXXXXXXXX
   NEXT_PUBLIC_SHOP_NAME = Your Store Name
   ```
5. Click **Save**

**Redeploy:**
```bash
vercel --prod
```

---

## 🔧 Step 5: Update CORS Settings (5 mins)

Now that you have both URLs, update backend CORS:

**Railway Dashboard:**
1. Go to your backend project
2. Click **Variables**
3. Update:
   ```
   MEDUSA_BACKEND_URL = https://your-backend.up.railway.app
   ADMIN_CORS = https://your-backend.up.railway.app,https://your-store.vercel.app
   STORE_CORS = https://your-store.vercel.app
   ```
4. Redeploy (Railway does this automatically)

---

## ✅ Step 6: Verify Deployment (10 mins)

### Backend Health Check

```bash
curl https://your-backend.up.railway.app/health
# Should return: {"status":"ok"} or similar
```

### Frontend Check

```bash
curl https://your-store.vercel.app
# Should return: HTML content
```

### Database Check

```bash
# Via Railway CLI
railway run npm run migrations:run
```

---

## 🧪 Step 7: Test with Real Payment (15 mins)

**CRITICAL:** Use small amount first!

1. Visit your store: `https://your-store.vercel.app`
2. Add an item to cart
3. Proceed to checkout
4. Fill in REAL shipping details
5. Use REAL payment method (your own card)
6. **Use small amount** (e.g., ₹10-50)
7. Complete payment

**Verify:**
- [ ] Payment successful
- [ ] Order created
- [ ] Redirected to order confirmation
- [ ] Order visible in admin: `https://your-backend.up.railway.app/app`
- [ ] Payment shows in Razorpay dashboard: https://dashboard.razorpay.com

**If successful:** 🎉 You're live!

**If failed:** Check logs:
```bash
# Railway logs
railway logs

# Vercel logs
vercel logs
```

---

## 🎯 Custom Domain Setup (Optional, 10 mins)

### For Vercel (Frontend)

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `yourstore.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 mins)

### For Railway (Backend)

1. Go to Railway Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Click **Generate Domain** or add custom domain
4. Update CORS settings with new domain
5. Update frontend env var: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`

---

## 🔍 Monitoring First Hour

### Watch These

**Razorpay Dashboard:**
- Monitor transactions
- Check for failed payments
- Verify settlements

**Railway Logs:**
```bash
railway logs --tail 100
```

**Vercel Logs:**
```bash
vercel logs --follow
```

**What to Look For:**
- ✅ Payment successful logs
- ✅ Order creation logs
- ❌ Any error messages
- ❌ Failed payments

---

## 🚨 Common Issues & Quick Fixes

### Issue: "CORS Error"
**Fix:**
1. Check STORE_CORS in backend env vars
2. Must match frontend URL exactly
3. Include protocol (https://)
4. Redeploy backend after change

### Issue: "Razorpay Key Invalid"
**Fix:**
1. Verify you're using LIVE key (rzp_live_)
2. Check frontend env var is set
3. Redeploy frontend after change
4. Clear browser cache

### Issue: "Database Connection Failed"
**Fix:**
1. Check DATABASE_URL is correct
2. Verify database is running
3. Test connection: `railway run psql $DATABASE_URL`
4. Check firewall allows connection

### Issue: "Payment Success but No Order"
**Fix:**
1. Check backend logs for errors
2. Verify cart completion endpoint
3. Check database for order record
4. Manually create order using payment ID
5. **Note:** This will be fixed when webhooks are implemented

---

## 📊 Success Checklist

After deployment, verify:

- [ ] Frontend accessible via URL
- [ ] Backend API responding
- [ ] Admin panel accessible
- [ ] Products loading
- [ ] Cart working
- [ ] Checkout loading
- [ ] Razorpay modal opens
- [ ] Test payment succeeds (small amount)
- [ ] Order created after payment
- [ ] Order visible in admin
- [ ] Payment in Razorpay dashboard
- [ ] No console errors
- [ ] Mobile responsive

**If all checked:** 🎉 **You're in production!**

---

## 🔄 Rollback Plan

If something goes wrong:

### Vercel Rollback
```bash
vercel rollback
```

Or via dashboard:
1. Go to Deployments
2. Find previous deployment
3. Click ••• → **Promote to Production**

### Railway Rollback
1. Go to Railway Dashboard
2. Click **Deployments**
3. Find previous deployment
4. Click **Redeploy**

---

## 📈 First Week Monitoring

### Daily Checks (5 mins each)

**Day 1:**
- Check every transaction
- Monitor error rate
- Review customer feedback

**Days 2-7:**
- Daily Razorpay dashboard check
- Review failed payments
- Check support tickets
- Monitor error logs

### Key Metrics

Track these:
- Payment success rate (target: > 95%)
- Order creation rate (target: > 99%)
- Support tickets (target: < 1% of orders)
- Average processing time (target: < 30s)

---

## 🎉 You're Live!

### What's Next?

**Immediate:**
- Monitor closely for first 24 hours
- Be ready to respond to issues
- Have rollback plan ready

**This Week:**
- Gather customer feedback
- Track key metrics
- Fix any minor issues

**Next Sprint:**
- Implement webhooks
- Add automatic refunds
- Enhance email notifications

---

## 📚 Quick Reference

### URLs
- **Frontend:** https://your-store.vercel.app
- **Backend:** https://your-backend.up.railway.app
- **Admin:** https://your-backend.up.railway.app/app
- **Razorpay:** https://dashboard.razorpay.com

### Commands
```bash
# Deploy frontend
vercel --prod

# Deploy backend
railway up

# View logs
railway logs
vercel logs

# Rollback
vercel rollback
```

### Support
- Razorpay: support@razorpay.com
- Vercel: vercel.com/support
- Railway: railway.app/help
- Medusa: discord.gg/medusajs

---

## ✅ Deployment Complete!

**Congratulations!** 🎊

Your Medusa v2 e-commerce store is now live with:
- ✅ Razorpay payment integration
- ✅ Order cancellation feature
- ✅ User-friendly error messages
- ✅ Customer-friendly status labels
- ✅ Production-ready infrastructure

**Total Time:** ~60 minutes

**Now:** Monitor, gather feedback, and iterate!

---

**Deployed:** ________________  
**Frontend URL:** ________________  
**Backend URL:** ________________  
**Status:** 🚀 LIVE

---

*For detailed information, see:*
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `TESTING_AND_DEPLOYMENT_CHECKLIST.md` - Full checklist
- `READY_FOR_PRODUCTION.md` - Production readiness summary
