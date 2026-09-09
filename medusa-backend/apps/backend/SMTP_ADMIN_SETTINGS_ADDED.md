# SMTP Admin Settings Feature - Implementation Complete ✅

## Overview

Added an Admin Store Settings section for managing SMTP configuration through the Medusa Admin UI. Admins can now configure and change Gmail SMTP accounts used for sending OTP verification emails without modifying code or environment variables.

---

## What Was Added

### 1. **Admin UI - SMTP Configuration Tab**

**Location:** Admin Dashboard → Store Settings → SMTP Email Setup

**Files Created/Modified:**
- ✅ `src/admin/routes/store-settings/components/smtp-tab.tsx` - New SMTP configuration UI component
- ✅ `src/admin/routes/store-settings/page.tsx` - Updated to include SMTP tab

**Features:**
- Configure SMTP Host (default: smtp.gmail.com)
- Configure SMTP Port (default: 587)
- Configure SMTP Username/Email
- Configure SMTP Password (securely encrypted, App Password support)
- Configure From Email Address
- Configure From Name (sender display name)
- **Test Email Functionality** - Send test emails to verify configuration
- Visual indicators and helpful tooltips
- Gmail-specific instructions for App Password setup

### 2. **Backend API Endpoint**

**Files Created:**
- ✅ `src/api/admin/smtp-test/route.ts` - API endpoint for sending test emails

**Endpoint:** `POST /admin/smtp-test`

**Request Body:**
```json
{
  "to": "test@example.com"
}
```

**Response:**
```json
{
  "message": "Test email sent successfully",
  "messageId": "<message-id>",
  "to": "test@example.com"
}
```

### 3. **Store Settings Service Enhancement**

**Files Modified:**
- ✅ `src/modules/store-settings/service.ts`

**New Settings Keys:**
- `smtp.host` - SMTP server hostname
- `smtp.port` - SMTP port number
- `smtp.user` - SMTP username/email
- `smtp.password` - SMTP password (encrypted, marked as secret)
- `smtp.from_email` - From email address
- `smtp.from_name` - From display name

**Storage:**
- Settings stored in database table `store_setting`
- Fallback to JSON file: `static/store-settings-store.json`
- Environment variables as final fallback
- Passwords automatically encrypted using AES-256

### 4. **SMTP Notification Service Update**

**Files Modified:**
- ✅ `src/modules/smtp-notification/services/smtp-notification.ts`

**Enhancements:**
- Now reads SMTP configuration from Store Settings dynamically
- Falls back to environment variables if Store Settings not configured
- Updates transporter configuration on each send operation
- Supports runtime configuration changes without server restart

---

## How It Works

### Configuration Priority (Highest to Lowest)

1. **Admin Store Settings** (Database or fallback file)
2. **Environment Variables** (.env file)

### Flow Diagram

```
Admin UI (SMTP Tab)
       ↓
  Save Settings
       ↓
Store Settings Service
       ↓
Database (store_setting table)
  + Fallback JSON File
       ↓
SMTP Notification Service
       ↓
  Reads Config Dynamically
       ↓
   Sends OTP Email
```

---

## Usage Guide

### For Admins

#### Access SMTP Settings

1. Log into Medusa Admin Dashboard
2. Navigate to **Store Settings** (sidebar)
3. Click on **📧 SMTP Email Setup** tab

#### Configure Gmail SMTP

1. **Generate Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Enable 2-Factor Authentication if not already enabled
   - Create a new App Password for "Mail"
   - Copy the generated 16-character password

2. **Fill in SMTP Settings:**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP Username: your-email@gmail.com
   SMTP Password: [paste 16-character App Password]
   From Email: your-email@gmail.com
   From Name: Your Store Name
   ```

3. **Test Configuration:**
   - Enter a test email address
   - Click "Send Test Email"
   - Check inbox for test email

4. **Save Settings:**
   - Click "Save SMTP Settings"
   - Settings take effect immediately

#### Switch to Different Gmail Account

Simply update the SMTP Username and Password fields with the new account credentials and save. No server restart required.

---

## Security Features

✅ **Password Encryption**
- SMTP passwords encrypted using AES-256-GCM
- Encryption key from `AUTH_MFA_ENCRYPTION_KEY` environment variable
- Passwords masked in UI (shows `****`)

✅ **Secure Storage**
- Passwords marked as `is_secret: true` in database
- Never logged or exposed in API responses
- Only decrypted when sending emails

✅ **Access Control**
- Admin-only endpoints
- Requires admin authentication
- Protected from unauthorized access

✅ **Environment Variables Protected**
- `.env` file in `.gitignore`
- Credentials never committed to repository

---

## API Endpoints

### 1. Get Store Settings (Including SMTP)

**Endpoint:** `GET /admin/store-settings`

**Response:**
```json
{
  "settings": {
    "smtp.host": {
      "value": "smtp.gmail.com",
      "is_secret": false
    },
    "smtp.port": {
      "value": "587",
      "is_secret": false
    },
    "smtp.user": {
      "value": "your-email@gmail.com",
      "is_secret": false
    },
    "smtp.password": {
      "value": "****",
      "is_secret": true
    },
    "smtp.from_email": {
      "value": "your-email@gmail.com",
      "is_secret": false
    },
    "smtp.from_name": {
      "value": "Your Store",
      "is_secret": false
    }
  }
}
```

### 2. Update Store Settings (Including SMTP)

**Endpoint:** `POST /admin/store-settings`

**Request Body:**
```json
{
  "settings": {
    "smtp.host": "smtp.gmail.com",
    "smtp.port": "587",
    "smtp.user": "new-email@gmail.com",
    "smtp.password": "new-app-password-here",
    "smtp.from_email": "new-email@gmail.com",
    "smtp.from_name": "New Store Name"
  }
}
```

### 3. Send Test Email

**Endpoint:** `POST /admin/smtp-test`

**Request Body:**
```json
{
  "to": "test@example.com"
}
```

---

## Testing

### Test SMTP Configuration

1. **Via Admin UI:**
   - Go to Store Settings → SMTP Email Setup
   - Enter test email address
   - Click "Send Test Email"
   - Check inbox

2. **Via API:**
   ```bash
   curl -X POST http://localhost:9000/admin/smtp-test \
     -H "Content-Type: application/json" \
     -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
     -d '{"to": "test@example.com"}'
   ```

3. **Test OTP Emails:**
   - Go to storefront registration
   - Enter email address
   - Request OTP
   - Check if OTP email arrives with new SMTP settings

---

## Database Schema

### Table: `store_setting`

| Column      | Type    | Description                          |
|-------------|---------|--------------------------------------|
| id          | string  | Primary key (UUID)                   |
| key         | string  | Setting key (e.g., "smtp.host")      |
| value       | string  | Setting value (encrypted if secret)  |
| is_secret   | boolean | Whether value should be encrypted    |
| created_at  | datetime| Creation timestamp                   |
| updated_at  | datetime| Last update timestamp                |

---

## Troubleshooting

### Emails Not Sending After Configuration Change

**Problem:** OTP emails not delivered after updating SMTP settings

**Solution:**
1. Check if settings were saved (refresh page, verify values)
2. Send test email to verify configuration
3. Check server logs for SMTP errors
4. Verify Gmail App Password is correct and active

### "Invalid Login" Error

**Problem:** Test email fails with authentication error

**Solution:**
1. Ensure 2FA is enabled on Gmail account
2. Generate a fresh App Password
3. Use the App Password, not your regular Gmail password
4. Remove any spaces from the App Password when pasting

### Settings Not Taking Effect

**Problem:** Still using old SMTP configuration

**Solution:**
1. Settings are loaded dynamically on each email send
2. No server restart needed
3. Verify settings saved correctly in Admin UI
4. Check database or fallback file has new values

### Port Connection Issues

**Problem:** Cannot connect to SMTP server

**Solution:**
1. Ensure port 587 is not blocked by firewall
2. Try port 465 with SSL if 587 fails
3. Check if your hosting provider blocks SMTP ports
4. Verify SMTP host is correct

---

## Migration Notes

### For Existing Installations

If you already have SMTP configured via environment variables:

1. **Environment variables still work** as fallback
2. Admin Store Settings take precedence
3. No migration required - both work simultaneously
4. Configure via Admin UI to override environment variables

### For New Installations

1. **Option 1:** Configure via Admin UI (recommended)
   - Log into admin
   - Go to Store Settings → SMTP Email Setup
   - Configure and test

2. **Option 2:** Use environment variables
   - Add SMTP variables to `.env`
   - Server will use these as defaults

---

## Production Recommendations

### Security Best Practices

1. **Use App Passwords**
   - Never use main Gmail password
   - Generate unique App Password for the application
   - Rotate passwords periodically

2. **Limit Access**
   - Only trusted admins should access Store Settings
   - Use strong admin passwords
   - Enable 2FA for admin accounts

3. **Monitor Email Activity**
   - Check Gmail's "Recent Activity"
   - Watch for suspicious sending patterns
   - Set up alerts for unusual activity

### Email Deliverability

1. **Set up SPF Record**
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **Configure DKIM**
   - Enable in Gmail admin console
   - Add DNS records

3. **Set up DMARC**
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

4. **Use Custom Domain**
   - Consider using custom domain email
   - Better branding and trust
   - Higher deliverability rates

### Alternative Email Services

For production, consider dedicated email services:
- **SendGrid** - Official Medusa provider
- **Mailgun** - High deliverability
- **Amazon SES** - Cost-effective for high volume
- **Postmark** - Excellent for transactional emails

---

## Features Not Changed

✅ Existing OTP functionality remains unchanged
✅ Email templates unchanged
✅ OTP generation and verification logic unchanged
✅ Customer registration flow unchanged
✅ Environment variable support maintained
✅ Security and encryption unchanged

---

## Summary

✅ **Admin UI** - Full SMTP configuration interface added
✅ **Dynamic Configuration** - Changes apply immediately without restart
✅ **Test Functionality** - Built-in email testing
✅ **Secure Storage** - Passwords encrypted in database
✅ **Backward Compatible** - Environment variables still work
✅ **No Breaking Changes** - All existing functionality preserved

**Status:** ✅ Fully functional and tested
**Last Updated:** August 23, 2026
**Author:** Kiro AI Assistant
