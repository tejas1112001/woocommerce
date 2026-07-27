# 🧪 Order Cancellation Feature - Testing Guide

**Date:** December 2024  
**Feature:** Customer Self-Service Order Cancellation  
**Purpose:** Step-by-step testing instructions

---

## 📋 Pre-Testing Setup

### Requirements:

- [ ] Frontend running: `npm run dev` (in `solace-medusa-starter`)
- [ ] Backend running: `npm run dev` (in `medusa-backend/apps/backend`)
- [ ] Customer account created and logged in
- [ ] At least one test order placed with Razorpay payment

### Test Environment:

- **Frontend:** http://localhost:8000
- **Backend:** http://localhost:9000
- **Admin Panel:** http://localhost:9000/app

---

## 🎯 Test Suite 1: Button Visibility Rules

### Test 1.1: Button Appears for Cancellable Order

**Objective:** Verify button shows when order is cancellable

**Steps:**
1. Place a new order with Razorpay test payment
2. Complete payment successfully (use card: `4111 1111 1111 1111`)
3. Note the order ID
4. Navigate to: Account → Orders → Click on the order
5. Scroll to bottom of order details

**Expected Result:**
- ✅ "Cancel Order" button is visible
- ✅ Button has red outline styling
- ✅ Button appears below Payment Details section

**Pass Criteria:**
- Button is visible
- Button is clickable
- Button has correct styling

---

### Test 1.2: Button Hidden for Fulfilled Order

**Objective:** Verify button disappears after fulfillment

**Steps:**
1. Use the order from Test 1.1
2. Log into Medusa Admin
3. Navigate to Orders → Select the test order
4. Click "Create Fulfillment"
5. Select all items
6. Click "Complete"
7. Return to customer frontend
8. Refresh the order details page

**Expected Result:**
- ❌ "Cancel Order" button is NOT visible
- ✅ Fulfillment status shows "Shipped"
- ✅ Order status still shows "Processing"

**Pass Criteria:**
- Button completely hidden
- No empty space where button was
- Page renders normally

---

### Test 1.3: Button Hidden for Already Cancelled Order

**Objective:** Verify button doesn't appear on cancelled orders

**Steps:**
1. Place a new order
2. Cancel the order (see Test 2.1 for how to cancel)
3. Return to order details page

**Expected Result:**
- ❌ "Cancel Order" button is NOT visible
- ✅ Order status shows "Cancelled"
- ✅ Fulfillment status shows "Cancelled" or "Preparing"

**Pass Criteria:**
- Button is hidden
- Status badges show cancelled state

---

### Test 1.4: Button Hidden for Completed Order

**Objective:** Verify button doesn't appear for completed orders

**Steps:**
1. Create an order and fulfill it completely
2. Admin: Mark as delivered
3. Wait for order to auto-complete
4. Customer: View order details

**Expected Result:**
- ❌ "Cancel Order" button is NOT visible
- ✅ Order status shows "Completed"
- ✅ Fulfillment status shows "Delivered"

**Pass Criteria:**
- Button is hidden
- Completed status visible

---

## 🎯 Test Suite 2: Cancellation Flow

### Test 2.1: Successful Order Cancellation

**Objective:** Complete cancellation flow successfully

**Steps:**
1. Place a new order with payment
2. Navigate to order details
3. Click "Cancel Order" button
4. Observe confirmation dialog

**Confirmation Dialog Checks:**
- [ ] Dialog title shows "Cancel Order #[order-number]?"
- [ ] Warning message is clear
- [ ] Refund information box is visible
- [ ] Two buttons present: "Yes, Cancel Order" and "No, Keep Order"

5. Click "Yes, Cancel Order"
6. Observe processing state
7. Wait for success message
8. Wait for page refresh (~2 seconds)

**Expected Result:**
- ✅ Loading state: "Cancelling..." appears
- ✅ Success message (green box) appears:
  > "Your order has been cancelled successfully. If you made a prepaid payment, a refund will be processed within 5-7 business days."
- ✅ Page refreshes automatically
- ✅ Order status badge shows "Cancelled"
- ✅ Cancel button is hidden

**Pass Criteria:**
- Smooth UX flow
- No errors in console
- Status updated correctly
- Admin sees cancelled order

---

### Test 2.2: Cancel Dialog Dismissal

**Objective:** Verify "No, Keep Order" works correctly

**Steps:**
1. Place a new order
2. Navigate to order details
3. Click "Cancel Order"
4. Wait for dialog to appear
5. Click "No, Keep Order"

**Expected Result:**
- ✅ Dialog closes immediately
- ✅ Order is NOT cancelled
- ✅ Order status remains "Processing"
- ✅ "Cancel Order" button still visible
- ✅ No success/error messages

**Pass Criteria:**
- Dialog closes cleanly
- Order status unchanged
- Can retry cancellation

---

### Test 2.3: Duplicate Cancellation Prevention

**Objective:** Verify duplicate submissions are prevented

**Steps:**
1. Place a new order
2. Click "Cancel Order"
3. Click "Yes, Cancel Order"
4. Immediately try to click the button again (quickly)

**Expected Result:**
- ✅ Button becomes disabled
- ✅ Button text changes to "Cancelling..."
- ✅ Loading spinner appears
- ✅ Cannot click button multiple times
- ✅ Only ONE cancellation request sent

**How to Verify:**
- Check browser Network tab (DevTools)
- Should see only ONE POST request
- Check console logs
- Should see only ONE "[Order] Cancellation initiated" log

**Pass Criteria:**
- Button disabled during processing
- No duplicate API calls
- No duplicate console logs

---

### Test 2.4: Already Cancelled Error

**Objective:** Verify error when trying to cancel already-cancelled order

**Steps:**
1. Use an order that's already cancelled
2. In browser console, try to call:
```javascript
// This simulates direct API call (for testing)
// Normal users won't have cancel button visible
```

**Alternative:**
1. Cancel an order
2. Before page refresh, click Cancel again

**Expected Result:**
- ❌ Error message (red box):
  > "This order has already been cancelled."
- ✅ Order status remains "Cancelled"
- ✅ No duplicate cancellation

**Pass Criteria:**
- Proper error message
- No system errors
- Graceful handling

---

## 🎯 Test Suite 3: Error Handling

### Test 3.1: Network Error Handling

**Objective:** Verify graceful handling of network errors

**Steps:**
1. Place a new order
2. Open Browser DevTools → Network tab
3. Set Network throttling to "Offline"
4. Click "Cancel Order"
5. Click "Yes, Cancel Order"
6. Wait for response

**Expected Result:**
- ❌ Error message appears:
  > "Failed to cancel the order. Please contact support if this issue persists."
- ✅ Order is NOT cancelled
- ✅ Button remains visible (can retry)
- ✅ Dialog stays open or closes gracefully

**Pass Criteria:**
- User-friendly error message
- No application crash
- Can retry after fixing network

---

### Test 3.2: Order Already Fulfilled Error

**Objective:** Verify error when order is already fulfilled

**Steps:**
1. Place an order
2. Admin: Create fulfillment
3. Customer: Try to cancel (if button still visible due to cache)

**Expected Result:**
- ❌ Error message:
  > "This order cannot be cancelled as it has already been processed for shipment."
- ✅ Order status unchanged
- ✅ Fulfillment status shows "Shipped"

**Pass Criteria:**
- Clear error explanation
- Order status correct

---

### Test 3.3: Unauthorized Access

**Objective:** Verify you can't cancel someone else's order

**Setup:**
1. User A places an order (Order ID: X)
2. User A logs out
3. User B logs in

**Steps:**
1. User B tries to access Order X URL directly
2. Or User B tries to cancel Order X via API

**Expected Result:**
- ❌ Order not visible to User B
- ❌ Or "Order not found" error
- ✅ Order belongs to User A only

**Pass Criteria:**
- Proper authorization
- No security breach

---

## 🎯 Test Suite 4: UI/UX Testing

### Test 4.1: Mobile Responsiveness

**Objective:** Verify feature works on mobile devices

**Steps:**
1. Open site on mobile device or use DevTools device emulation
2. Place and view an order
3. Test cancel button

**Check:**
- [ ] Button is full-width and touch-friendly
- [ ] Dialog fits on screen
- [ ] Text is readable
- [ ] Buttons are easy to tap
- [ ] No horizontal scrolling
- [ ] Success/error messages visible

**Devices to Test:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

---

### Test 4.2: Loading States

**Objective:** Verify all loading states work correctly

**Check During Cancellation:**
- [ ] Button shows "Cancelling..." text
- [ ] Button displays loading spinner
- [ ] Button is disabled (not clickable)
- [ ] "No, Keep Order" button also disabled
- [ ] Cursor shows loading state

**Pass Criteria:**
- Clear visual feedback
- User knows system is processing
- Cannot trigger duplicate actions

---

### Test 4.3: Message Display

**Objective:** Verify messages are clear and well-styled

**Success Message Check:**
- [ ] Green background
- [ ] Clear text
- [ ] Proper spacing
- [ ] Icon or checkmark (if applicable)
- [ ] Message is concise and helpful

**Error Message Check:**
- [ ] Red background
- [ ] Clear explanation
- [ ] Actionable guidance
- [ ] Proper spacing
- [ ] No technical jargon

---

## 🎯 Test Suite 5: Integration Testing

### Test 5.1: Admin Panel Sync

**Objective:** Verify admin sees cancelled orders correctly

**Steps:**
1. Customer cancels an order
2. Admin refreshes admin panel
3. Navigate to Orders
4. Find the cancelled order

**Expected Result in Admin:**
- ✅ Order status: "canceled"
- ✅ Order appears in order list
- ✅ All order details preserved
- ✅ Timeline shows cancellation event
- ✅ No payment capture issues

**Pass Criteria:**
- Admin has full visibility
- Can process refund manually
- Order history complete

---

### Test 5.2: Order Status Consistency

**Objective:** Verify status is consistent everywhere

**Check in Multiple Places:**

1. **Order Details Page:**
   - [ ] Status badge shows "Cancelled"
   - [ ] Fulfillment shows "Cancelled" or "Preparing"

2. **Order List Page:**
   - [ ] Order shows as "Cancelled"
   - [ ] Can identify cancelled orders easily

3. **Admin Panel:**
   - [ ] Order status: "canceled"
   - [ ] Consistent with customer view

**Pass Criteria:**
- Same status everywhere
- No confusion
- Clear cancelled indicator

---

### Test 5.3: Payment Status After Cancellation

**Objective:** Verify payment status remains correct

**Steps:**
1. Place order with Razorpay payment
2. Verify payment status: "Paid"
3. Cancel the order
4. Check payment status again

**Expected Result:**
- ✅ Payment status still shows "Paid"
- ✅ Payment collection preserved
- ✅ Payment ID still visible
- ✅ Refund will be processed separately

**Pass Criteria:**
- Payment data intact
- Can track payment for refund
- Admin can process refund

---

## 🎯 Test Suite 6: Edge Cases

### Test 6.1: Rapid Button Clicking

**Objective:** Test spam-clicking the cancel button

**Steps:**
1. Place an order
2. Click "Cancel Order"
3. Rapidly click "Yes, Cancel Order" multiple times

**Expected Result:**
- ✅ Only one cancellation processed
- ✅ Button disabled after first click
- ✅ No multiple API calls
- ✅ No errors in console

---

### Test 6.2: Browser Back Button

**Objective:** Test browser navigation during cancellation

**Steps:**
1. Click "Cancel Order"
2. Dialog appears
3. Click browser back button

**Expected Result:**
- ✅ Dialog closes OR
- ✅ Navigation happens normally
- ✅ Order not cancelled
- ✅ No errors

---

### Test 6.3: Page Refresh During Cancellation

**Objective:** Test refresh during processing

**Steps:**
1. Click "Cancel Order"
2. Click "Yes, Cancel Order"
3. Immediately refresh the page (F5)

**Expected Result:**
- ✅ Either: Cancellation completes
- ✅ Or: Page reloads, order still cancellable
- ✅ No stuck state
- ✅ No system errors

---

### Test 6.4: Multiple Browser Tabs

**Objective:** Test cancellation from multiple tabs

**Steps:**
1. Open order in Tab 1
2. Open same order in Tab 2
3. Cancel from Tab 1
4. Try to cancel from Tab 2

**Expected Result:**
- ✅ Tab 1: Cancellation succeeds
- ✅ Tab 2: Shows error (already cancelled)
- ✅ Or Tab 2: Button disappears after refresh

---

## 🎯 Test Suite 7: Performance Testing

### Test 7.1: API Response Time

**Objective:** Verify cancellation is fast

**Steps:**
1. Cancel an order
2. Measure time from click to success message

**Expected Result:**
- ✅ Response within 2-3 seconds
- ✅ No long waits
- ✅ Loading indicator shown

---

### Test 7.2: Page Refresh Performance

**Objective:** Verify page refresh after cancellation

**Steps:**
1. Cancel order successfully
2. Measure time for page refresh

**Expected Result:**
- ✅ Page refreshes within 2 seconds
- ✅ No loading issues
- ✅ Status updated immediately

---

## 📊 Test Results Template

### Test Execution Summary:

```
Test Date: _______________
Tester Name: _______________
Environment: _______________

Test Suite 1: Button Visibility Rules
  ✅ Test 1.1: Button Appears for Cancellable Order
  ✅ Test 1.2: Button Hidden for Fulfilled Order  
  ✅ Test 1.3: Button Hidden for Already Cancelled Order
  ✅ Test 1.4: Button Hidden for Completed Order

Test Suite 2: Cancellation Flow
  ✅ Test 2.1: Successful Order Cancellation
  ✅ Test 2.2: Cancel Dialog Dismissal
  ✅ Test 2.3: Duplicate Cancellation Prevention
  ✅ Test 2.4: Already Cancelled Error

Test Suite 3: Error Handling
  ✅ Test 3.1: Network Error Handling
  ✅ Test 3.2: Order Already Fulfilled Error
  ✅ Test 3.3: Unauthorized Access

Test Suite 4: UI/UX Testing
  ✅ Test 4.1: Mobile Responsiveness
  ✅ Test 4.2: Loading States
  ✅ Test 4.3: Message Display

Test Suite 5: Integration Testing
  ✅ Test 5.1: Admin Panel Sync
  ✅ Test 5.2: Order Status Consistency
  ✅ Test 5.3: Payment Status After Cancellation

Test Suite 6: Edge Cases
  ✅ Test 6.1: Rapid Button Clicking
  ✅ Test 6.2: Browser Back Button
  ✅ Test 6.3: Page Refresh During Cancellation
  ✅ Test 6.4: Multiple Browser Tabs

Test Suite 7: Performance Testing
  ✅ Test 7.1: API Response Time
  ✅ Test 7.2: Page Refresh Performance

Total Tests: 24
Passed: ___
Failed: ___
Blocked: ___

Issues Found:
1. _______________
2. _______________
3. _______________
```

---

## 🐛 Bug Reporting Template

If you find issues during testing, report them using this format:

```markdown
### Bug #[number]

**Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Browser Console Errors:**
```
[Paste any errors]
```

**Environment:**
- Browser: 
- OS: 
- Frontend version:
- Backend version:

**Additional Notes:**
[Any other relevant information]
```

---

## ✅ Sign-Off Checklist

### Before Marking Tests as Complete:

- [ ] All test suites executed
- [ ] Pass rate >= 95%
- [ ] Critical bugs fixed
- [ ] Edge cases tested
- [ ] Mobile tested
- [ ] Admin panel verified
- [ ] Error messages reviewed
- [ ] Performance acceptable
- [ ] Console clean (no errors)
- [ ] Documentation reviewed

### Approval:

- **Tested By:** _______________
- **Date:** _______________
- **Status:** ☐ Approved ☐ Needs Work
- **Notes:** _______________

---

## 🚀 Production Readiness

### Feature is Production Ready When:

- ✅ All test suites pass
- ✅ No critical/high bugs
- ✅ Mobile works correctly
- ✅ Admin integration verified
- ✅ Error handling robust
- ✅ Performance acceptable
- ✅ Documentation complete
- ✅ Team trained on feature

---

*End of Testing Guide*
