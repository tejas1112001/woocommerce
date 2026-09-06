# 🧪 OTP Verification Testing Guide

## Quick Test Instructions

### Prerequisites
- ✅ Backend running on http://localhost:9000
- ✅ Frontend running on http://localhost:8001  
- ✅ Gmail SMTP configured in backend `.env`

---

## Test 1: Complete Happy Path ✅

### Step 1: Open Registration Page
```
http://localhost:8001/account
```
Click "Create account" tab

### Step 2: Fill Registration Form
- **First Name**: Test
- **Last Name**: User
- **Email**: youremail+test1@gmail.com (use your actual email)
- **Phone**: (optional)
- **Password**: Test@123
- **Check** "I read and agree to Terms & Conditions"
- Click **"Continue"**

### Step 3: Check Email
- Open your email inbox
- Look for email from "Om Swami Enterprises"
- Subject: "Verify Your Email - Om Swami Enterprises"
- Find the 6-digit code (e.g., 123456)

### Step 4: Enter OTP
- You should see OTP verification screen automatically
- Enter the 6-digit code from email
- Code auto-submits when all digits entered

### Step 5: Verify Success
- ✅ "Email verified successfully!" toast message
- ✅ Account created automatically
- ✅ Auto-logged in
- ✅ Redirected to /account dashboard
- ✅ Your name appears in the profile

---

## Test 2: Duplicate Email Prevention 🚫

### Steps:
1. Try to register with the SAME email again
2. Fill the form and click "Continue"

### Expected Result:
- ❌ Error: "An account with this email already exists. Please login instead."
- No OTP sent
- Form stays on registration page

---

## Test 3: Invalid OTP Entry ❌

### Steps:
1. Register with a new email (youremail+test2@gmail.com)
2. Receive OTP email
3. Enter WRONG code (e.g., 999999)

### Expected Result:
- ❌ Error: "Invalid OTP. 4 attempts remaining."
- OTP fields cleared
- Focus returns to first input
- Can try again

---

## Test 4: OTP Expiration ⏱

### Steps:
1. Register with a new email
2. Receive OTP
3. Wait 10+ minutes (or temporarily change `OTP_EXPIRY_MINUTES` to 1 for quick test)
4. Try to verify expired OTP

### Expected Result:
- ❌ Error: "OTP has expired. Please request a new one."
- Resend button available

---

## Test 5: Max Attempts Exceeded 🔒

### Steps:
1. Register with a new email
2. Receive OTP
3. Enter wrong code 5 times

### Expected Result:
- After 5th wrong attempt:
- ❌ Error: "Maximum attempts exceeded. Please request a new OTP."
- Must use Resend to get new code

---

## Test 6: Resend OTP 🔄

### Steps:
1. Register with a new email
2. Receive OTP
3. Click "Resend Code" button

### Expected Behavior:
- First 60 seconds: Button shows "Resend in 55s" (disabled)
- After 60 seconds: Button shows "Resend Code" (enabled)
- Click resend
- ✅ "New verification code sent!" toast
- Check email for new code
- Timer resets to 10:00
- New cooldown starts (60s)

---

## Test 7: Resend Rate Limiting ⏳

### Steps:
1. Register with a new email
2. Try to resend OTP 4 times within 1 hour

### Expected Result:
- First 3 resends: Success
- 4th resend: ❌ Error: "Maximum resend limit reached. Please try again later."

---

## Test 8: Paste OTP Code 📋

### Steps:
1. Register with a new email
2. Receive OTP email
3. Copy the 6-digit code from email
4. Click on first OTP input field
5. Paste (Ctrl+V or Cmd+V)

### Expected Result:
- ✅ All 6 digits filled automatically
- ✅ Auto-submits verification
- ✅ Account created if code is valid

---

## Test 9: Back Button Navigation ←

### Steps:
1. Start registration
2. Reach OTP verification screen
3. Click "← Change email address"

### Expected Result:
- Returns to registration form
- Form fields still filled with previous data
- Can edit email or other fields
- Click "Continue" to send OTP to new email

---

## Test 10: Checkout Flow Integration 🛒

### Steps:
1. Add a product to cart (without login)
2. Go to checkout
3. You'll be redirected to login with `?redirectTo=/checkout`
4. Click "Create account"
5. Complete registration with OTP
6. Verify email

### Expected Result:
- ✅ After account creation
- ✅ Auto-logged in
- ✅ Redirected BACK to /checkout (not /account)
- ✅ Cart preserved
- ✅ Can complete purchase

---

## Test 11: Existing Customer Login 👤

### Verify no breaking changes

### Steps:
1. Go to http://localhost:8001/account
2. Enter existing customer credentials
3. Click "Sign in"

### Expected Result:
- ✅ Login works normally (no OTP required)
- ✅ Redirected to /account
- ✅ No breaking changes

---

## Test 12: Password Reset Flow 🔑

### Verify no breaking changes

### Steps:
1. Go to http://localhost:8001/account
2. Click "Forgot password?"
3. Enter email
4. Click "Reset password"

### Expected Result:
- ✅ Password reset email sent
- ✅ Reset link works
- ✅ Can set new password
- ✅ No OTP verification required
- ✅ No breaking changes

---

## 🔍 Manual Testing Checklist

### UI/UX Tests
- [ ] OTP inputs are properly styled
- [ ] Timer counts down correctly
- [ ] Resend button shows cooldown
- [ ] Error messages are clear
- [ ] Toast notifications appear
- [ ] Loading states work
- [ ] Responsive on mobile
- [ ] Auto-focus works
- [ ] Paste support works
- [ ] Back button works

### Functional Tests
- [ ] OTP email received within 10 seconds
- [ ] OTP code is 6 digits
- [ ] Correct OTP verifies successfully
- [ ] Wrong OTP shows error
- [ ] Expired OTP rejected
- [ ] Max attempts enforced
- [ ] Resend cooldown works
- [ ] Resend limit enforced
- [ ] Duplicate email prevented
- [ ] Account created after verification

### Security Tests
- [ ] OTP stored as hash in database
- [ ] Cannot verify without valid email
- [ ] Cannot create account without OTP
- [ ] Verification token has expiry
- [ ] Rate limiting works
- [ ] IP address logged
- [ ] Old OTPs can be cleaned up

### Integration Tests
- [ ] Existing login works
- [ ] Password reset works
- [ ] Checkout guard works
- [ ] Session management works
- [ ] Cart preserved through registration
- [ ] Redirects work correctly

---

## 🐛 Debug Commands

### Check Backend Logs
```bash
# Watch backend console for:
# - "OTP sent to email@example.com"
# - "📧 Email sent successfully"
# - "OTP verified successfully for email@example.com"
```

### Check Database
```sql
-- Connect to PostgreSQL
psql -d your_database_name

-- View OTP records
SELECT 
  email, 
  attempts, 
  verified, 
  resend_count,
  expires_at,
  created_at 
FROM otp_verification 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if customer was created
SELECT id, email, first_name, last_name, created_at 
FROM customer 
WHERE email = 'youremail+test1@gmail.com';
```

### Test OTP API Directly
```bash
# Send OTP
curl -X POST http://localhost:9000/store/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:9000/store/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# Resend OTP
curl -X POST http://localhost:9000/store/otp/resend \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Email Template in Browser
1. Go to backend logs
2. Find the OTP code that was generated
3. Copy OTP code
4. Open `medusa-backend/apps/backend/src/modules/otp-verification/templates/otp-email.ts`
5. Replace OTP in template and save to HTML file
6. Open in browser to preview

---

## ✅ Success Criteria

After completing these tests, verify:

- [x] All happy path tests pass
- [x] All error scenarios handled correctly
- [x] No breaking changes to existing functionality
- [x] Email delivery works reliably
- [x] UI is user-friendly and responsive
- [x] Security measures are in place
- [x] Performance is acceptable (< 3s for OTP send)

---

## 🚨 Common Issues & Solutions

### Issue: Email not received
**Check**:
1. Spam/junk folder
2. SMTP credentials in backend `.env`
3. Backend console for email errors
4. Gmail "Less secure app access" or App Password

### Issue: Cannot verify OTP
**Check**:
1. Code is exactly 6 digits
2. OTP hasn't expired (< 10 minutes)
3. Haven't exceeded max attempts (5)
4. Entering correct email that received OTP

### Issue: "Email already registered"
**Solution**: Use a different email or use the login flow instead

### Issue: Resend button disabled
**Reason**: 60-second cooldown active
**Solution**: Wait for countdown to reach 0

### Issue: Build errors
**Solution**:
```bash
# Backend
cd medusa-backend/apps/backend
npm run build

# Frontend  
cd solace-medusa-starter
npm run build
```

---

## 📞 Support

If you encounter issues:

1. Check backend logs (terminal running `npm run dev`)
2. Check frontend console (browser DevTools)
3. Review error messages carefully
4. Check database for OTP records
5. Verify email SMTP configuration

---

**Ready to test!** 🚀

Start with Test 1 (Happy Path) to verify the complete flow works end-to-end.
