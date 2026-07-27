# User Dashboard Complete Checklist
**Date**: July 9, 2026  
**Application**: Swami Om Enterprises E-Commerce Platform

---

## Testing Guide

### Prerequisites
1. ✅ Backend running on http://localhost:9000
2. ✅ Frontend running on http://localhost:8000
3. ✅ Test product available (Test Product - ID: prod_01KX35C55WSZREQSYXK5W07DBG)
4. ⏳ User account created for testing

---

## 1. Authentication Flow

### 1.1 Registration
**URL**: http://localhost:8000/in/account (Sign Up Tab)

**Test Steps**:
1. Navigate to account page
2. Click on "Sign Up" or "Create Account"
3. Fill in registration form:
   - First Name: Test
   - Last Name: User
   - Email: testuser@example.com
   - Password: Test@123456
   - Phone: +91 9876543210 (optional)
4. Click "Create Account"

**Expected Results**:
- ✅ Account created successfully
- ✅ Auto-login after registration
- ✅ Redirect to dashboard /in/account/@dashboard
- ✅ Welcome message displays

**Verification**:
- [ ] No console errors
- [ ] Success toast/message shown
- [ ] Redirected to dashboard
- [ ] User name displays correctly

---

### 1.2 Login
**URL**: http://localhost:8000/in/account (Login Tab)

**Test Steps**:
1. If logged in, logout first
2. Navigate to account page
3. Enter email: testuser@example.com
4. Enter password: Test@123456
5. Optional: Check "Remember Me"
6. Click "Sign In"

**Expected Results**:
- ✅ Login successful
- ✅ JWT token set in cookies
- ✅ Redirect to dashboard
- ✅ Session persists on page reload

**Verification**:
- [ ] No console errors
- [ ] Cookie _medusa_jwt set in browser
- [ ] Dashboard loads correctly
- [ ] User information displays

---

### 1.3 Logout
**Location**: Dashboard menu

**Test Steps**:
1. Navigate to dashboard
2. Click "Logout" button/link
3. Confirm logout if prompted

**Expected Results**:
- ✅ Session cleared
- ✅ Cookies removed
- ✅ Redirect to home or account page
- ✅ Cannot access protected pages

**Verification**:
- [ ] Cookies cleared
- [ ] Redirect successful
- [ ] Protected routes inaccessible

---

## 2. Dashboard Overview

### 2.1 Dashboard Home
**URL**: http://localhost:8000/in/account/@dashboard

**Elements to Verify**:
- [ ] Welcome message with user name
- [ ] Recent orders summary
- [ ] Quick action buttons
- [ ] Navigation menu/sidebar
- [ ] User profile picture/avatar (if applicable)
- [ ] Notification count (if applicable)

**Expected Layout**:
```
+------------------+------------------------+
|   Sidebar Menu   |   Main Content Area    |
| - Dashboard      | - Welcome Message      |
| - Profile        | - Recent Orders        |
| - Orders         | - Quick Actions        |
| - Addresses      | - Statistics           |
| - Returns        |                        |
| - Wishlist       |                        |
| - Settings       |                        |
| - Logout         |                        |
+------------------+------------------------+
```

**Verification**:
- [ ] All menu items visible
- [ ] Responsive on mobile
- [ ] No layout shifts
- [ ] Images load correctly

---

## 3. Profile Management

### 3.1 View Profile
**URL**: http://localhost:8000/in/account/@dashboard/profile

**Information Displayed**:
- [ ] First Name
- [ ] Last Name
- [ ] Email
- [ ] Phone Number
- [ ] Account creation date
- [ ] Profile picture (if applicable)

**Verification**:
- [ ] All fields display correctly
- [ ] Data matches registration info

---

### 3.2 Edit Profile
**Location**: Profile page

**Test Steps**:
1. Click "Edit Profile" or edit icon
2. Update First Name to "Updated Test"
3. Update Phone to "+91 9876543211"
4. Click "Save Changes"

**Expected Results**:
- ✅ Success message displayed
- ✅ Profile updated in database
- ✅ New information displays immediately
- ✅ Changes persist after refresh

**Verification**:
- [ ] Form validation works
- [ ] Email field is read-only or requires verification
- [ ] Save button shows loading state
- [ ] Success feedback displayed

---

### 3.3 Change Password
**Location**: Profile page or Settings

**Test Steps**:
1. Navigate to Change Password section
2. Enter Current Password: Test@123456
3. Enter New Password: Test@654321
4. Confirm New Password: Test@654321
5. Click "Update Password"

**Expected Results**:
- ✅ Password changed successfully
- ✅ Confirmation message shown
- ✅ Can login with new password
- ✅ Old password no longer works

**Verification**:
- [ ] Current password validated
- [ ] New password meets requirements
- [ ] Passwords match validation
- [ ] Logout after password change (optional)

---

## 4. Order Management

### 4.1 Orders List
**URL**: http://localhost:8000/in/account/@dashboard/orders

**Display Elements**:
- [ ] List of all orders
- [ ] Order number
- [ ] Order date
- [ ] Order status (Pending, Confirmed, Shipped, Delivered, Cancelled)
- [ ] Order total
- [ ] Number of items
- [ ] View Details button/link

**Test Steps**:
1. Navigate to Orders page
2. Verify order list displays
3. Check pagination (if multiple orders)
4. Test filter/sort functionality (if available)

**Expected Results**:
- ✅ All orders displayed
- ✅ Most recent orders first
- ✅ Status badges with correct colors
- ✅ Empty state if no orders

**Verification**:
- [ ] Order data correct
- [ ] Status updates real-time
- [ ] Pagination works
- [ ] Loading states shown

---

### 4.2 Order Details
**URL**: http://localhost:8000/in/account/@dashboard/orders/[order_id]

**Information Displayed**:
- [ ] Order number
- [ ] Order date and time
- [ ] Order status with timeline
- [ ] Items list with images, names, quantities, prices
- [ ] Subtotal
- [ ] Shipping cost
- [ ] Tax
- [ ] Discounts (if applicable)
- [ ] Total amount
- [ ] Payment method
- [ ] Payment status
- [ ] Shipping address
- [ ] Billing address
- [ ] Tracking information (if shipped)

**Test Steps**:
1. Click on an order from the list
2. Verify all information displays
3. Check item images load
4. Test "View Invoice" button (if available)
5. Test "Track Order" button (if available)
6. Test "Cancel Order" (if applicable and allowed)
7. Test "Request Return" button

**Expected Results**:
- ✅ Complete order information shown
- ✅ Items match cart at checkout
- ✅ Prices calculate correctly
- ✅ Status timeline accurate
- ✅ Download invoice works
- ✅ Tracking link works

**Verification**:
- [ ] All data accurate
- [ ] No missing information
- [ ] Actions work correctly
- [ ] Print/Download works

---

### 4.3 Reorder Functionality
**Location**: Order details page

**Test Steps**:
1. Navigate to a completed order
2. Click "Reorder" button
3. Verify items added to cart
4. Check quantities match original order

**Expected Results**:
- ✅ All items added to cart
- ✅ Redirect to cart or confirmation shown
- ✅ Out-of-stock items handled gracefully
- ✅ Price changes noted (if applicable)

**Verification**:
- [ ] Cart updated correctly
- [ ] Item availability checked
- [ ] User notified of changes

---

## 5. Address Management

### 5.1 Address Book
**URL**: http://localhost:8000/in/account/@dashboard/addresses

**Display Elements**:
- [ ] List of all saved addresses
- [ ] Default shipping address marked
- [ ] Default billing address marked
- [ ] Add New Address button
- [ ] Edit button for each address
- [ ] Delete button for each address

**Verification**:
- [ ] All addresses display
- [ ] Default badges show correctly
- [ ] Layout responsive

---

### 5.2 Add New Address
**Location**: Addresses page

**Test Steps**:
1. Click "Add New Address"
2. Fill in address form:
   - First Name: Test
   - Last Name: User
   - Address Line 1: 123 Test Street
   - Address Line 2: Apt 4B (optional)
   - City: Mumbai
   - State/Province: Maharashtra
   - Postal Code: 400001
   - Country: India
   - Phone: +91 9876543210
3. Check "Set as default shipping address" (optional)
4. Check "Set as default billing address" (optional)
5. Click "Save Address"

**Expected Results**:
- ✅ Address saved successfully
- ✅ Appears in address list
- ✅ Default flags set correctly
- ✅ Form cleared or redirected

**Verification**:
- [ ] Form validation works
- [ ] Required fields enforced
- [ ] Phone format validated
- [ ] Postal code validated
- [ ] Success message shown

---

### 5.3 Edit Address
**Location**: Addresses page

**Test Steps**:
1. Click "Edit" on an existing address
2. Update Address Line 1 to "456 Updated Street"
3. Update Postal Code
4. Click "Save Changes"

**Expected Results**:
- ✅ Address updated successfully
- ✅ Changes reflected immediately
- ✅ Form closes or redirects
- ✅ Success message shown

**Verification**:
- [ ] Changes persist
- [ ] Other addresses unaffected
- [ ] Default status maintained

---

### 5.4 Delete Address
**Location**: Addresses page

**Test Steps**:
1. Click "Delete" on a non-default address
2. Confirm deletion in modal/prompt
3. Verify address removed from list

**Expected Results**:
- ✅ Confirmation prompt shown
- ✅ Address deleted after confirmation
- ✅ List updated immediately
- ✅ Cannot delete default address without changing default first

**Verification**:
- [ ] Confirmation required
- [ ] Address removed from database
- [ ] No error if address in use by order
- [ ] Default address protection

---

### 5.5 Set Default Address
**Location**: Addresses page

**Test Steps**:
1. Click "Set as Default" for shipping
2. Verify badge updates
3. Click "Set as Default" for billing
4. Verify badge updates

**Expected Results**:
- ✅ Only one default shipping address
- ✅ Only one default billing address
- ✅ Previous default unmarked
- ✅ New default marked

**Verification**:
- [ ] Default updates correctly
- [ ] Only one default per type
- [ ] Updates persist

---

## 6. Returns Management

### 6.1 Returns List
**URL**: http://localhost:8000/in/account/@dashboard/returns

**Display Elements**:
- [ ] List of all return requests
- [ ] Return number
- [ ] Order number
- [ ] Return date
- [ ] Return status (Requested, Approved, In Transit, Completed, Rejected)
- [ ] Items being returned
- [ ] Refund amount
- [ ] View Details link

**Test Steps**:
1. Navigate to Returns page
2. Verify returns list displays
3. Check empty state if no returns

**Expected Results**:
- ✅ All returns displayed
- ✅ Status correctly shown
- ✅ Most recent first
- ✅ Empty state message if no returns

**Verification**:
- [ ] Return data accurate
- [ ] Status badges colored correctly
- [ ] Amounts correct

---

### 6.2 Create Return Request
**Location**: Order details page

**Test Steps**:
1. Navigate to a delivered order
2. Click "Request Return"
3. Select items to return
4. Select return reason for each item
5. Enter additional comments (optional)
6. Upload images (if supported)
7. Click "Submit Return Request"

**Expected Results**:
- ✅ Return request created
- ✅ Return confirmation shown
- ✅ Return appears in returns list
- ✅ Order status updated
- ✅ Email confirmation sent (if configured)

**Verification**:
- [ ] Only eligible items shown
- [ ] Reasons required
- [ ] Image upload works
- [ ] Return window enforced (e.g., 30 days)

---

### 6.3 View Return Details
**URL**: http://localhost:8000/in/account/@dashboard/returns/[return_id]

**Information Displayed**:
- [ ] Return number
- [ ] Order number link
- [ ] Return date
- [ ] Return status with timeline
- [ ] Items being returned with details
- [ ] Return reasons
- [ ] Refund amount breakdown
- [ ] Refund method
- [ ] Refund status
- [ ] Return shipping label (if provided)
- [ ] Tracking information
- [ ] Communication/notes history

**Verification**:
- [ ] All information accurate
- [ ] Status timeline correct
- [ ] Download label works
- [ ] Cancel return works (if allowed)

---

## 7. Wishlist

### 7.1 Wishlist Page
**URL**: http://localhost:8000/in/account/@dashboard/wishlist

**Display Elements**:
- [ ] Grid/list of wishlist items
- [ ] Product images
- [ ] Product names
- [ ] Product prices
- [ ] Stock status
- [ ] "Add to Cart" button for each item
- [ ] "Remove from Wishlist" button
- [ ] Share wishlist option (if available)

**Test Steps**:
1. Navigate to Wishlist page
2. Verify items display
3. Check empty state if no items

**Expected Results**:
- ✅ All wishlist items shown
- ✅ Current prices displayed
- ✅ Stock status updated
- ✅ Empty state with call-to-action

**Verification**:
- [ ] Images load correctly
- [ ] Prices current
- [ ] Links work
- [ ] Layout responsive

---

### 7.2 Add to Wishlist
**Location**: Product page

**Test Steps**:
1. Navigate to a product page
2. Click "Add to Wishlist" heart icon
3. Verify icon fills/changes state
4. Check toast/confirmation message
5. Navigate to wishlist page
6. Verify product appears in list

**Expected Results**:
- ✅ Product added to wishlist
- ✅ Visual feedback immediate
- ✅ Confirmation message shown
- ✅ Works without login (saves to session, prompts to login to save permanently)

**Verification**:
- [ ] Icon toggles correctly
- [ ] Toast notification shows
- [ ] Product in wishlist
- [ ] Persists after refresh (if logged in)

---

### 7.3 Remove from Wishlist
**Location**: Wishlist page or Product page

**Test Steps**:
1. Navigate to wishlist
2. Click "Remove" on an item
3. Verify item removed immediately
4. Optionally, test removing from product page

**Expected Results**:
- ✅ Item removed from wishlist
- ✅ No confirmation required (or quick undo option)
- ✅ Visual feedback immediate
- ✅ List updates

**Verification**:
- [ ] Item removed instantly
- [ ] No errors
- [ ] Page doesn't reload
- [ ] Undo option works (if available)

---

### 7.4 Move to Cart from Wishlist
**Location**: Wishlist page

**Test Steps**:
1. Navigate to wishlist
2. Select variant if applicable
3. Click "Add to Cart" for an item
4. Verify item added to cart
5. Item remains in wishlist (typically)

**Expected Results**:
- ✅ Item added to cart
- ✅ Cart count updates
- ✅ Success message shown
- ✅ Item still in wishlist (common pattern)
- ✅ Out-of-stock items disabled

**Verification**:
- [ ] Cart updated
- [ ] Stock checked
- [ ] Variant selection works
- [ ] Multiple items can be added

---

## 8. Account Settings

### 8.1 Account Information
**URL**: http://localhost:8000/in/account/@dashboard/settings (or Profile)

**Settings Available**:
- [ ] Personal Information (Name, Email, Phone)
- [ ] Password Management
- [ ] Email Preferences/Notifications
- [ ] Language Preference (if multi-language)
- [ ] Currency Preference (if applicable)
- [ ] Marketing Preferences
- [ ] Privacy Settings
- [ ] Two-Factor Authentication (if available)

**Verification**:
- [ ] All settings accessible
- [ ] Changes save correctly
- [ ] Toggles work
- [ ] Email verification for email changes

---

### 8.2 Email Notifications
**Location**: Settings page

**Test Steps**:
1. Navigate to notification settings
2. Toggle different notification types:
   - Order confirmations
   - Shipping updates
   - Promotional emails
   - Newsletter
3. Save preferences

**Expected Results**:
- ✅ Preferences saved
- ✅ Emails sent/not sent according to preferences
- ✅ Unsubscribe link works in emails

**Verification**:
- [ ] Toggles persist
- [ ] Email behavior matches settings
- [ ] Can re-subscribe easily

---

### 8.3 Delete Account
**Location**: Settings page (usually at bottom)

**Test Steps**:
1. Navigate to account deletion section
2. Click "Delete Account"
3. Enter password for confirmation
4. Confirm deletion in modal
5. Account deleted

**Expected Results**:
- ✅ Strong confirmation required
- ✅ Warns about data loss
- ✅ Password required
- ✅ Account and data deleted
- ✅ Cannot login after deletion
- ✅ Email confirmation sent

**Verification**:
- [ ] Multiple confirmations
- [ ] Data handling complies with GDPR (if applicable)
- [ ] Order history handling explained
- [ ] Cannot be undone easily

---

## 9. Additional Features

### 9.1 Order Search/Filter
**Location**: Orders page

**Test Steps**:
1. Use search box to find order by number
2. Filter by status
3. Filter by date range
4. Sort by date, amount, etc.

**Expected Results**:
- ✅ Search returns correct results
- ✅ Filters work independently and combined
- ✅ Results update dynamically
- ✅ Clear filters option available

**Verification**:
- [ ] Search accurate
- [ ] Filters functional
- [ ] Performance acceptable

---

### 9.2 Mobile Responsiveness
**All Dashboard Pages**

**Test Steps**:
1. Open dashboard on mobile device or use browser dev tools
2. Test all pages at various breakpoints:
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1440px, 1920px
3. Verify navigation menu (hamburger/drawer)
4. Check touch targets are adequate (min 44x44px)
5. Test forms on mobile

**Expected Results**:
- ✅ All pages responsive
- ✅ Navigation adapts (drawer/hamburger menu)
- ✅ Tables scroll or adapt
- ✅ Forms usable on mobile
- ✅ Images scale properly
- ✅ No horizontal scroll
- ✅ Touch-friendly interface

**Verification**:
- [ ] Breakpoints work
- [ ] Content readable
- [ ] Interactions work on touch
- [ ] Performance acceptable on mobile network

---

### 9.3 Accessibility
**All Dashboard Pages**

**Test Steps**:
1. Navigate using keyboard only (Tab, Enter, Esc)
2. Use screen reader (NVDA, JAWS, VoiceOver)
3. Check color contrast ratios
4. Verify alt text on images
5. Test with browser accessibility tools

**Expected Results**:
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Screen reader compatible
- ✅ ARIA labels present
- ✅ Semantic HTML used
- ✅ Forms have labels
- ✅ Errors announced
- ✅ Color contrast meets WCAG 2.1 AA

**Verification**:
- [ ] Tab order logical
- [ ] Skip links available
- [ ] No keyboard traps
- [ ] Screen reader announces correctly
- [ ] Form errors clear

---

## 10. Error Handling

### 10.1 Network Errors
**Test Steps**:
1. Disconnect internet
2. Try to load dashboard pages
3. Try to save changes
4. Reconnect internet

**Expected Results**:
- ✅ Offline message shown
- ✅ Actions queued or prevented
- ✅ Retry option available
- ✅ Data not lost
- ✅ Graceful recovery on reconnect

**Verification**:
- [ ] Error messages clear
- [ ] No silent failures
- [ ] User can retry
- [ ] Data integrity maintained

---

### 10.2 Session Expiry
**Test Steps**:
1. Login to dashboard
2. Wait for session to expire (or manually delete JWT token)
3. Try to perform an action
4. Attempt to navigate to a protected page

**Expected Results**:
- ✅ Redirect to login page
- ✅ Message about session expiry
- ✅ Return to intended page after login
- ✅ No data loss if filling forms

**Verification**:
- [ ] Session timeout appropriate
- [ ] Redirect works
- [ ] Return URL preserved
- [ ] Form data preserved

---

### 10.3 Validation Errors
**Test Steps**:
1. Try to save profile with invalid email
2. Try to save address with missing required fields
3. Try to change password with wrong current password
4. Try to submit return without selecting items

**Expected Results**:
- ✅ Client-side validation before submit
- ✅ Server-side validation
- ✅ Clear error messages
- ✅ Field-specific errors highlighted
- ✅ Error summary at top of form

**Verification**:
- [ ] Errors clear and actionable
- [ ] Multiple errors shown
- [ ] Errors clear when fixed
- [ ] No false positives

---

## Testing Checklist Summary

### Pre-Testing Setup
- [ ] Backend running on port 9000
- [ ] Frontend running on port 8000
- [ ] Test user account created
- [ ] At least one test product available
- [ ] At least one test order placed

### Critical Path Testing (Priority 1)
- [ ] User registration
- [ ] User login
- [ ] Add to cart from product page
- [ ] View cart
- [ ] Checkout process
- [ ] Order placement
- [ ] View order in dashboard
- [ ] User logout

### Extended Testing (Priority 2)
- [ ] Edit profile
- [ ] Change password
- [ ] View all orders
- [ ] View order details
- [ ] Add address
- [ ] Edit address
- [ ] Delete address
- [ ] Add to wishlist
- [ ] View wishlist
- [ ] Move wishlist to cart

### Advanced Testing (Priority 3)
- [ ] Create return request
- [ ] View return details
- [ ] Email notifications
- [ ] Search orders
- [ ] Filter orders
- [ ] Reorder
- [ ] Share wishlist
- [ ] Delete account

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### Responsive Testing
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1440px)

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Focus indicators

### Error Handling Testing
- [ ] Network errors
- [ ] Session expiry
- [ ] Validation errors
- [ ] Server errors (500)
- [ ] Not found errors (404)

---

## Bug Reporting Template

When you find an issue, please report it with:

**Bug Title**: [Brief description]

**Priority**: Critical / High / Medium / Low

**Page/Feature**: [Dashboard page or feature name]

**Steps to Reproduce**:
1. Step one
2. Step two
3. ...

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happened]

**Screenshots/Video**: [If applicable]

**Console Errors**: [Copy from browser console]

**Browser**: [Chrome 120, Firefox 121, etc.]

**Device**: [Desktop, Mobile - iPhone 14, etc.]

**Additional Context**: [Any other relevant information]

---

## Testing Notes

- Test with both authenticated and guest users where applicable
- Test with empty states (no orders, no addresses, etc.)
- Test with maximum data (many orders, many addresses, etc.)
- Test concurrent actions (multiple tabs open)
- Test with slow network (throttle in dev tools)
- Clear cache and cookies between major test runs
- Document any workarounds or known issues
- Note performance issues (slow loading, laggy interactions)

---

## Sign-off

**Tester Name**: ___________________________

**Date Tested**: ___________________________

**Test Result**: PASS / FAIL / PARTIAL

**Notes**: 
____________________________________________
____________________________________________
____________________________________________

