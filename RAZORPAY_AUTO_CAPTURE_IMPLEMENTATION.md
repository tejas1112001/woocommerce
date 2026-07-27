# Razorpay Auto-Capture Implementation Guide

## Overview
This document explains the changes made to implement automatic payment capture in Medusa v2 + Razorpay integration, removing the need for manual "Capture Payment" action in the admin dashboard.

## Current Behavior (Before Changes)
- Customer completes payment successfully
- Admin sees: "Payment: Authorized" + "Outstanding Amount: Full order amount" + "Total Paid: ₹0"
- Admin must manually click "Capture Payment"
- Customer sees: "Payment Authorized" (confusing message)

## New Behavior (After Changes)
- Customer completes payment successfully
- Payment is automatically captured
- Admin sees: "Payment: Captured" + "Outstanding Amount: ₹0" + "Total Paid: Order total"
- Customer sees: "Payment Successful" with clear confirmation message
- No manual capture needed

## Implementation Details

### 1. Backend Configuration Changes

#### File: `medusa-backend/apps/backend/medusa-config.ts`
**Purpose**: Enable auto-capture in Razorpay provider configuration

**Change**:
- Added `auto_capture: true` option to Razorpay provider configuration
- This tells Razorpay to automatically capture payments after authorization

**Why**: The Razorpay provider supports auto-capture mode through the `auto_capture` option. When enabled, the `authorizePayment()` method automatically changes payment status from `AUTHORIZED` to `CAPTURED`.

---

### 2. Frontend Display Changes

#### File: `solace-medusa-starter/src/lib/constants.tsx`
**Purpose**: Add payment status mapping for better user-facing labels

**Changes**:
- Added `PAYMENT_STATUS_LABELS` constant to map technical status to user-friendly labels
- Maps "authorized" → "Paid" and "captured" → "Paid" for customer clarity
- Added helper function `getPaymentStatusLabel()` to retrieve labels

**Why**: Technical statuses like "authorized" and "captured" are confusing for customers. "Paid" is clearer and more accurate from a customer perspective.

---

#### File: `solace-medusa-starter/src/modules/order/templates/order-details-template.tsx`
**Purpose**: Update order details page to show user-friendly payment status

**Changes**:
- Import and use `getPaymentStatusLabel()` helper
- Display "Paid" instead of "Authorized" or "Captured"
- Payment badge now shows customer-friendly label

**Why**: Ensures consistency across all order views. Customers see clear "Paid" status instead of technical jargon.

---

#### File: `solace-medusa-starter/src/modules/order/templates/order-completed-template.tsx`
**Purpose**: Update order confirmation page with clear payment success messaging

**Changes**:
- Added payment status badge showing "Paid"
- Added clear confirmation message: "We've received your payment and your order has been placed successfully."
- Enhanced visual feedback with proper status display

**Why**: The order confirmation page is the first thing customers see after payment. Clear messaging reduces confusion and support requests.

---

#### File: `solace-medusa-starter/src/modules/account/components/order-card/index.tsx`
**Purpose**: Update order list in customer account with consistent payment status

**Changes**:
- Use `getPaymentStatusLabel()` for payment status display
- Show "Paid" instead of technical status
- Consistent labeling across all customer-facing views

**Why**: Maintains consistency when customers view their order history. All orders show clear "Paid" status.

---

### 3. Payment Flow Changes

#### File: `solace-medusa-starter/src/modules/checkout/components/payment-button/razorpay-payment-button.tsx`
**Purpose**: Handle successful payment and ensure proper order creation

**Change**: No changes needed - the existing flow works correctly

**How it works**:
1. Customer completes payment in Razorpay modal
2. Success handler receives payment confirmation
3. Calls `placeOrder()` which triggers `sdk.store.cart.complete()`
4. Backend processes payment authorization
5. With `auto_capture: true`, backend automatically captures payment
6. Order is created with "captured" status
7. Customer is redirected to confirmation page

**Why**: The existing checkout flow is sound. The key change is enabling auto-capture in the backend configuration, which makes the provider automatically capture payments during the authorization step.

---

## Technical Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ CUSTOMER JOURNEY                                                │
└─────────────────────────────────────────────────────────────────┘

1. Customer clicks "Pay with Razorpay"
   ↓
2. Razorpay modal opens with payment options
   ↓
3. Customer completes payment (card/UPI/netbanking)
   ↓
4. Razorpay returns success response
   ↓
5. Frontend calls placeOrder()
   ↓
6. Backend: cart.complete() → authorizePayment()
   ↓
7. Backend: auto_capture = true → Status changed to CAPTURED
   ↓
8. Order created with payment_status = "captured"
   ↓
9. Customer redirected to confirmation page
   ↓
10. Shows "Payment Successful" + "Paid" status

┌─────────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD                                                 │
└─────────────────────────────────────────────────────────────────┘

- Payment Status: Captured ✓
- Total Paid: ₹1,500
- Outstanding Amount: ₹0
- No manual capture needed
- Admin can proceed with fulfillment
```

---

## Status Separation (Order vs Payment vs Fulfillment)

The implementation maintains clear separation between three different statuses:

### Order Status
- Represents the overall order lifecycle
- Values: Pending → Processing → Completed/Canceled
- Admin workflow for order management

### Payment Status
- Represents payment lifecycle
- Values: Pending → Authorized → **Captured** (auto)
- Now automatically captured on successful payment
- No admin action needed

### Fulfillment Status
- Represents shipping/delivery lifecycle
- Values: Unfulfilled → Processing → Packed → Shipped → Delivered
- Admin workflow for physical fulfillment

**Key Point**: Payment auto-capture does NOT affect order or fulfillment status. These remain independent, allowing admins to manage fulfillment separately from payment processing.

---

## Webhook Integration (Future Enhancement)

**Current Implementation**: Uses synchronous payment confirmation from Razorpay modal

**Webhook Support (Not Yet Implemented)**:
- Code is structured to support webhooks later
- `webhook_secret` already configured in medusa-config.ts
- Razorpay provider has `getWebhookActionAndData()` method ready
- Can add webhook endpoint without changing existing flow

**When to Add Webhooks**:
- For payment reconciliation
- For delayed capture scenarios
- For refund notifications
- For dispute handling

**Structure for Webhook Addition**:
```typescript
// Future: medusa-backend/apps/backend/src/api/webhooks/razorpay/route.ts
export async function POST(req: Request) {
  // Verify webhook signature
  // Process payment events
  // Update payment sessions
  // No changes to existing checkout flow
}
```

---

## Testing Checklist

### Backend Testing
- [ ] Order created with payment_status = "captured"
- [ ] payment_collection.status = "captured"
- [ ] payment_session.status = "captured"
- [ ] No "authorized" status lingering

### Admin Dashboard Testing
- [ ] Payment Status shows "Captured" (not "Authorized")
- [ ] Total Paid = Order Total
- [ ] Outstanding Amount = ₹0
- [ ] No "Capture Payment" button visible
- [ ] Order Status = "Pending" (independent of payment)
- [ ] Fulfillment Status = "Unfulfilled" (independent of payment)

### Customer Frontend Testing
- [ ] Order confirmation page shows "Payment Successful"
- [ ] Payment status badge shows "Paid"
- [ ] Clear confirmation message displayed
- [ ] Order details page shows "Paid" status
- [ ] Order history shows "Paid" for all captured payments
- [ ] No confusing "Authorized" text anywhere

### Edge Cases
- [ ] Failed payment: Shows error, no order created
- [ ] Dismissed payment: Shows dismissal message, no order created
- [ ] Network error during placeOrder(): Error handling works
- [ ] Multiple payment attempts: Only successful payment captured

---

## Configuration Reference

### Environment Variables (Backend)
```env
# Test credentials
RAZORPAY_TEST_KEY_ID=rzp_test_xxxxx
RAZORPAY_TEST_KEY_SECRET=xxxxx
RAZORPAY_TEST_ACCOUNT=xxxxx
RAZORPAY_TEST_AUTO_EXPIRY_PERIOD=20
RAZORPAY_TEST_MANUAL_EXPIRY_PERIOD=7200
RAZORPAY_TEST_WEBHOOK_SECRET=xxxxx

# Production credentials (fallback)
RAZORPAY_ID=rzp_live_xxxxx
RAZORPAY_SECRET=xxxxx
RAZORPAY_ACCOUNT=xxxxx
```

### Environment Variables (Frontend)
```env
NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_SHOP_NAME="Your Store Name"
NEXT_PUBLIC_SHOP_DESCRIPTION="Complete your order"
```

---

## Benefits of This Implementation

1. **Reduced Admin Workload**: No manual capture step needed
2. **Faster Order Processing**: Payments immediately captured
3. **Better Customer Experience**: Clear "Paid" messaging
4. **Reduced Confusion**: No "Authorized" ambiguity
5. **Lower Support Burden**: Customers understand payment status
6. **Webhook-Ready**: Structured for future webhook integration
7. **Separation of Concerns**: Payment, order, and fulfillment remain independent

---

## Rollback Plan

If auto-capture needs to be disabled:

1. Remove `auto_capture: true` from medusa-config.ts
2. Restart backend server
3. Payments will revert to manual capture
4. Frontend changes can remain (they handle both statuses)

---

## Support and Troubleshooting

### Issue: Payment shows "Authorized" instead of "Captured"
**Solution**: Verify `auto_capture: true` is in medusa-config.ts and backend was restarted

### Issue: Order created but payment not captured
**Solution**: Check Razorpay provider logs, verify API credentials, check Razorpay dashboard

### Issue: Frontend shows "Authorized" label
**Solution**: Clear browser cache, verify constant updates deployed

### Issue: Admin sees "Capture Payment" button
**Solution**: This is a Medusa admin UI feature - check payment_collection.status in database

---

## Code Maintainability

The implementation follows these principles:

1. **Minimal Backend Changes**: Only configuration change in medusa-config.ts
2. **Provider Agnostic**: Uses Razorpay's built-in auto-capture feature
3. **Centralized Constants**: Payment labels in one place (constants.tsx)
4. **Reusable Helpers**: `getPaymentStatusLabel()` used across components
5. **Backward Compatible**: Handles both "authorized" and "captured" statuses
6. **Webhook Ready**: No breaking changes needed when adding webhooks

