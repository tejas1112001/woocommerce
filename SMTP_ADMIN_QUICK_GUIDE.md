# Quick Guide: Configure SMTP via Admin Panel

## 📧 How to Change Gmail SMTP Account for OTP Emails

### Step 1: Generate Gmail App Password

1. Go to **https://myaccount.google.com/apppasswords**
2. If prompted, enable **2-Factor Authentication**
3. Click **"Generate App Password"**
4. Select **"Mail"** as the app type
5. Copy the **16-character password** (e.g., `abcd efgh ijkl mnop`)

---

### Step 2: Access Admin Settings

1. Open your Medusa Admin Dashboard: **http://localhost:9000/app**
2. Log in with admin credentials
3. Click **"Store Settings"** in the sidebar
4. Click the **"📧 SMTP Email Setup"** tab

---

### Step 3: Configure SMTP Settings

Fill in the following fields:

| Field              | Value                          | Example                        |
|--------------------|--------------------------------|--------------------------------|
| SMTP Host          | `smtp.gmail.com`               | smtp.gmail.com                 |
| SMTP Port          | `587`                          | 587                            |
| SMTP Username      | Your Gmail email               | store@gmail.com                |
| SMTP Password      | App Password (16 chars)        | abcdefghijklmnop               |
| From Email         | Your Gmail email               | store@gmail.com                |
| From Name          | Your store name                | Om Swami Enterprises           |

---

### Step 4: Test Configuration

1. Scroll down to **"Test Email Configuration"**
2. Enter your email address in the test field
3. Click **"Send Test Email"**
4. Check your inbox for the test email
5. If received successfully, configuration is correct! ✅

---

### Step 5: Save Settings

1. Click **"Save SMTP Settings"** button
2. Wait for success notification
3. Settings are now active immediately!

---

## ✨ Benefits

- ✅ Change SMTP account anytime without touching code
- ✅ No need to restart server
- ✅ Test before saving
- ✅ Secure password encryption
- ✅ Visual confirmation
- ✅ Works immediately for OTP emails

---

## 🔄 To Switch to a Different Gmail Account

Simply:
1. Follow Step 1 to generate App Password for new account
2. Update the Username and Password fields
3. Test with new configuration
4. Save settings

**That's it!** OTP emails will now send from the new account.

---

## 🛡️ Security Notes

- Passwords are encrypted in database
- Only admins can access Store Settings
- App Passwords are safer than regular passwords
- Never share your App Password

---

## ❓ Troubleshooting

### "Invalid Login" Error
- Make sure 2FA is enabled on Gmail
- Regenerate the App Password
- Remove spaces when pasting App Password

### Test Email Not Received
- Check spam/junk folder
- Verify email address is correct
- Check if Gmail account is active
- Ensure App Password is valid

### "SMTP Connection Failed"
- Verify port 587 is not blocked
- Check SMTP Host is exactly `smtp.gmail.com`
- Ensure internet connection is stable

---

## 📚 More Information

See `SMTP_ADMIN_SETTINGS_ADDED.md` for complete technical documentation.

---

**Quick Access:** Admin Dashboard → Store Settings → 📧 SMTP Email Setup
