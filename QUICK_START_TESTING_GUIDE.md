# Quick Start Testing Guide
**For**: Swami Om Enterprises E-Commerce Platform  
**Purpose**: Fast reference for immediate testing

---

## 🚀 Start Services

### Terminal 1: Backend
```cmd
cd medusa-backend\apps\backend
npm run dev
```
Wait for: `Server is ready on port 9000`

### Terminal 2: Frontend
```cmd
cd solace-medusa-starter
npm run dev
```
Wait for: `Ready on http://localhost:8000`

---

## ✅ Quick Verification

### Run Automated Test
```powershell
.\fix-and-verify.ps1
```

**Expected Output**: All checks should show `[OK]` in green

---

## 🔍 Test Add to Cart (Critical)

### Step 1: Open Product Page
```
http://localhost:8000/in/products/test-product
```

### Step 2: Open Browser Dev Tools
- Press **F12**
- Click **Console** tab
- Click **Clear** (🚫 icon)

### Step 3: Click "Add to Cart"

### Step 4: Check Console
Look for these log messages:
```
[ProductActions] Adding to cart: {...}
[addToCart] Starting with: {...}
[addToCart] Cart retrieved: cart_...
[addToCart] Successfully added item to cart
[ProductActions] Successfully added to cart
```

### Step 5: If Errors Appear
1. Take screenshot of console
2. Copy error text
3. Check Network tab for failed requests (red items)
4. Note which request failed

---

## 📋 Critical User Flows to Test

### Flow 1: Guest Purchase (10 min)
1. ✅ Browse to product page
2. ✅ Add to cart
3. ✅ View cart
4. ✅ Go to checkout (should redirect to login)
5. ✅ Create account
6. ✅ Should return to checkout
7. ✅ Enter address
8. ✅ Select shipping
9. ✅ Select payment
10. ✅ Place order
11. ✅ View confirmation

### Flow 2: Registered User (5 min)
1. ✅ Login
2. ✅ Add product to cart
3. ✅ Checkout with saved address
4. ✅ Complete purchase
5. ✅ View order in dashboard

### Flow 3: Dashboard (15 min)
Use: `USER_DASHBOARD_CHECKLIST.md`

Quick checks:
- ✅ View profile
- ✅ View orders
- ✅ View order details
- ✅ Add address
- ✅ Add to wishlist
- ✅ Logout

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to backend"
**Fix**: Check backend is running on port 9000
```powershell
# Test backend
Invoke-RestMethod http://localhost:9000/health
```

### Issue: "Product not found"
**Fix**: Add product via admin panel
```
http://localhost:9000/app
```

### Issue: "CORS error"
**Fix**: Check backend .env.local has:
```env
STORE_CORS=http://localhost:8000
```

### Issue: "Cart not working"
**Check**: 
1. Publishable key set in frontend .env.local
2. Browser console for errors
3. Network tab for failed API calls

---

## 🎯 Key URLs

### Frontend
- Home: http://localhost:8000/in
- Shop: http://localhost:8000/in/shop
- Product: http://localhost:8000/in/products/test-product
- Cart: http://localhost:8000/in/cart
- Checkout: http://localhost:8000/in/checkout
- Account: http://localhost:8000/in/account
- Dashboard: http://localhost:8000/in/account/@dashboard

### Backend
- Health: http://localhost:9000/health
- Admin: http://localhost:9000/app

---

## 📊 Success Criteria

### Backend ✅
- [ ] Health endpoint returns 200
- [ ] Products API returns data
- [ ] Can create cart via API
- [ ] Can add items to cart via API

### Frontend ⏳
- [ ] Pages load without errors
- [ ] Add to cart works
- [ ] Cart displays items
- [ ] Checkout flow completes
- [ ] Order appears in dashboard

### User Experience ⏳
- [ ] No console errors
- [ ] Buttons work
- [ ] Forms validate
- [ ] Toast notifications show
- [ ] Responsive on mobile

---

## 🐛 If You Find Issues

### Report Format
```markdown
**Issue**: [Brief description]
**Page**: [URL]
**Steps**: 
1. Step 1
2. Step 2

**Expected**: [What should happen]
**Actual**: [What happened]
**Console Error**: [Paste error]
**Screenshot**: [Attach if helpful]
```

### Where to Report
Create file: `BUG_REPORT_[DATE].md`

---

## 📱 Mobile Testing

### Chrome DevTools
1. Press F12
2. Click device icon (📱)
3. Select device from dropdown
4. Test all flows

### Devices to Test
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1440px)

---

## ⚡ Quick Commands Reference

### Check Backend Status
```powershell
Invoke-RestMethod http://localhost:9000/health
```

### Check Products
```powershell
Invoke-RestMethod http://localhost:9000/store/products -Headers @{"x-publishable-api-key"="pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf"}
```

### Run Full Verification
```powershell
.\fix-and-verify.ps1
```

### Check Frontend Build
```powershell
cd solace-medusa-starter
npm run build
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `COMPLETE_E2E_QA_REPORT.md` | Comprehensive test results |
| `USER_DASHBOARD_CHECKLIST.md` | Detailed dashboard testing |
| `E2E_TEST_RESULTS_AND_FIXES.md` | API test results |
| `fix-and-verify.ps1` | Automated verification script |
| `QUICK_START_TESTING_GUIDE.md` | This file |

---

## ✨ Tips

### Testing Best Practices
1. ✅ Test in incognito mode (no extensions)
2. ✅ Clear browser cache before major tests
3. ✅ Check console BEFORE testing
4. ✅ Test on multiple browsers
5. ✅ Test on mobile devices
6. ✅ Document everything

### Browser Console Shortcuts
- **F12**: Open Dev Tools
- **Ctrl+Shift+C**: Element inspector
- **Ctrl+L**: Clear console
- **Ctrl+Shift+M**: Toggle device toolbar

### Useful Console Commands
```javascript
// Check if cart exists
localStorage.getItem('_medusa_cart_id')

// Check cookies
document.cookie

// Clear cart
localStorage.removeItem('_medusa_cart_id')
```

---

## 🎬 Testing Video Checklist

If recording tests:
1. ✅ Show URL in address bar
2. ✅ Keep console visible
3. ✅ Show network tab when relevant
4. ✅ Narrate what you're testing
5. ✅ Show success and failures
6. ✅ Note timestamps of issues

---

## 🎯 Priority Testing Order

### Must Test (Critical) ⚡
1. Add to Cart
2. View Cart
3. Checkout Flow
4. Order Placement
5. Login/Logout

### Should Test (Important) 🔶
1. Product Listing
2. Product Details
3. User Registration
4. View Orders
5. Address Management

### Nice to Test (Enhancement) 🔷
1. Wishlist
2. Returns
3. Profile Editing
4. Search/Filter
5. Mobile Responsiveness

---

## 🏁 Testing Complete Checklist

- [ ] Backend verified with script
- [ ] Frontend loads without errors
- [ ] Add to cart works in browser
- [ ] Cart page displays items
- [ ] Checkout flow completes
- [ ] Order appears in dashboard
- [ ] Login/logout works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Documentation updated

---

## 💡 Need Help?

### Check These First
1. `COMPLETE_E2E_QA_REPORT.md` - Full report
2. Console logs with `[addToCart]` and `[ProductActions]` tags
3. Network tab in browser dev tools
4. Backend terminal for errors
5. Frontend terminal for errors

### Still Stuck?
1. Run: `.\fix-and-verify.ps1`
2. Check: Backend and Frontend running
3. Verify: Environment variables set
4. Test: In incognito mode
5. Try: Different browser

---

**Last Updated**: July 9, 2026  
**Version**: 1.0  
**Status**: Ready for Testing

🚀 **You're ready to test! Start with the automated script, then test Add to Cart manually.**

