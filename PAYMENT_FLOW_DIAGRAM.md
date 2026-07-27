# Razorpay Payment Flow - Visual Diagram

## Complete Payment Flow (After Auto-Capture Implementation)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    CUSTOMER JOURNEY                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

1. CHECKOUT PAGE
   │
   ├─ Customer adds products to cart
   ├─ Fills shipping address
   ├─ Selects shipping method
   └─ Selects "Razorpay" as payment method
      │
      └─ Clicks "Pay with Razorpay" button
         │
         ▼

2. RAZORPAY PAYMENT MODAL
   │
   ├─ Modal opens with payment options
   │  • Credit/Debit Card
   │  • UPI
   │  • Net Banking
   │  • Wallet
   │
   ├─ Customer selects payment method
   ├─ Enters payment details
   ├─ Completes authentication (OTP/3D Secure)
   └─ Payment processed by Razorpay
      │
      ├─ SUCCESS ────────────────────► Continue to Step 3
      │
      ├─ FAILURE ────────────────────► Error message displayed
      │                                 "Payment failed. Please try again."
      │                                 Cart remains active
      │
      └─ DISMISSED ──────────────────► User closed modal
                                        Cart remains active
                                        Can retry payment

         ▼

3. FRONTEND SUCCESS HANDLER
   (razorpay-payment-button.tsx)
   │
   ├─ Receives payment confirmation
   │  { razorpay_payment_id: "pay_xxxxx" }
   │
   ├─ Validates response
   │
   └─ Calls placeOrder()
      │
      ▼

4. BACKEND API CALL
   sdk.store.cart.complete(cartId)
   │
   ├─ Validates cart
   ├─ Validates payment session
   ├─ Triggers payment authorization workflow
   │
   └─ Calls Razorpay Provider
      │
      ▼

5. RAZORPAY PROVIDER (authorizePayment)
   (medusa-plugin-razorpay-v2)
   │
   ├─ Fetches payment details from Razorpay API
   │  GET /orders/{order_id}
   │  GET /orders/{order_id}/payments
   │
   ├─ Verifies payment is authorized
   │  payment.status === "authorized" ✓
   │
   ├─ Checks auto_capture configuration
   │  if (options.auto_capture === true)  ← THIS IS KEY
   │     │
   │     ├─ Changes status: AUTHORIZED → CAPTURED
   │     ├─ Updates payment_session.status = "captured"
   │     └─ Updates payment_collection.status = "captured"
   │
   └─ Returns payment data
      {
        status: "captured",  ← Auto-captured!
        data: { razorpayOrder: {...} }
      }
      │
      ▼

6. ORDER CREATION
   │
   ├─ Medusa creates order record
   │  {
   │    id: "order_xxxxx",
   │    display_id: "1234",
   │    status: "pending",           ← Order status
   │    payment_status: "captured",  ← Payment captured!
   │    fulfillment_status: "not_fulfilled",
   │    total: 1500,
   │    currency_code: "inr"
   │  }
   │
   ├─ Creates payment_collection
   │  {
   │    status: "captured",          ← Auto-captured!
   │    amount: 1500,
   │    captured_amount: 1500,       ← Full amount!
   │    authorized_amount: 1500
   │  }
   │
   ├─ Links payment_session
   │  {
   │    status: "captured",          ← Auto-captured!
   │    data: { razorpayOrder: {...} }
   │  }
   │
   ├─ Removes cart (cart_id deleted)
   │
   └─ Returns order object to frontend
      │
      ▼

7. FRONTEND REDIRECT
   │
   ├─ checkoutContext.onOrderCompleted(order)
   │
   └─ Navigate to confirmation page
      /[country]/order/confirmed/[orderId]
      │
      ▼

8. ORDER CONFIRMATION PAGE
   │
   ┌─────────────────────────────────────────────┐
   │  ✓ Thank you! Your order was placed         │
   │    successfully.                             │
   │                                              │
   │  ┌──────────────────┐                       │
   │  │  Payment         │  ← Green badge        │
   │  │  Successful      │                       │
   │  └──────────────────┘                       │
   │                                              │
   │  We've received your payment and your       │
   │  order has been placed successfully.        │
   │                                              │
   │  Order #1234                                │
   │  Placed on July 16, 2026                    │
   │                                              │
   │  Payment Status: Paid ✓                     │
   │  Order Status: Pending                      │
   │  Fulfillment: Unfulfilled                   │
   └─────────────────────────────────────────────┘
      │
      ▼

9. CUSTOMER ACCOUNT - ORDER DETAILS
   │
   ┌─────────────────────────────────────────────┐
   │  Order #1234                                │
   │  Placed on July 16, 2026                    │
   │                                              │
   │  ┌─────┐ ┌─────────┐ ┌──────┐              │
   │  │Pending│ │Unfulfilled│ │ Paid │  ← Clear!  │
   │  └─────┘ └─────────┘ └──────┘              │
   │                                              │
   │  Order Items: [...]                         │
   │  Total: ₹1,500                              │
   └─────────────────────────────────────────────┘
      │
      ▼

10. CUSTOMER ACCOUNT - ORDER HISTORY
    │
    ┌──────────────────────────────────────────┐
    │  My Orders                                │
    │                                           │
    │  #1234  July 16, 2026  Pending  Paid ✓  │
    │  #1233  July 15, 2026  Pending  Paid ✓  │
    │  #1232  July 14, 2026  Completed Paid ✓  │
    └──────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    ADMIN DASHBOARD                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Order #1234 Details

┌────────────────────────────────────────────────┐
│ Order Status: Pending                          │
│ Payment Status: Captured ✓                     │
│ Fulfillment Status: Unfulfilled                │
│                                                 │
│ Payment Summary:                                │
│ ├─ Total: ₹1,500                               │
│ ├─ Paid: ₹1,500  ✓                            │
│ └─ Outstanding: ₹0  ✓                          │
│                                                 │
│ [No "Capture Payment" button]  ✓              │
│                                                 │
│ Next Actions:                                   │
│ • Process order for fulfillment                │
│ • Create shipment                               │
│ • Mark as shipped                               │
└────────────────────────────────────────────────┘

```

---

## Status Flow Diagram

### Payment Status Journey:

```
PENDING
   │
   │ Customer initiates checkout
   │
   ▼
REQUIRES_MORE
   │
   │ Razorpay order created
   │ Waiting for customer input
   │
   ▼
AUTHORIZED
   │
   │ Customer completes payment
   │ Razorpay authorizes transaction
   │
   ▼
┌──────────────────┐
│  AUTO-CAPTURE    │ ← auto_capture: true
│  ENABLED         │   (medusa-config.ts)
└──────────────────┘
   │
   │ Status automatically changed
   │ by Razorpay provider
   │
   ▼
CAPTURED ✓
   │
   │ Payment complete
   │ Funds will be settled
   │
   ▼
[Order ready for fulfillment]
```

### Before Auto-Capture (Manual Flow):

```
AUTHORIZED
   │
   │ ⏸️  Admin must manually click
   │    "Capture Payment" button
   │
   ▼
API Call: capturePayment()
   │
   ▼
CAPTURED ✓
```

---

## Three Independent Status Flows

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃         PAYMENT STATUS FLOW             ┃
┃  (Automatic - No Admin Action)          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

pending → requires_more → authorized → CAPTURED ✓
                                           │
                                           ▼
                                    [Auto-capture]
                                    No admin action


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          ORDER STATUS FLOW              ┃
┃  (Manual - Admin Controls)              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

PENDING ────► processing ────► completed
   │                               │
   │                               ▼
   └────────────────────► canceled


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      FULFILLMENT STATUS FLOW            ┃
┃  (Manual - Admin Workflow)              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

not_fulfilled → processing → packed → shipped → delivered
       │
       │ Admin creates shipment
       ▼
    fulfilling
```

**Key Point**: Payment auto-capture does NOT affect order or fulfillment status.

---

## Code Execution Flow

```
FRONTEND (React Component)
┌─────────────────────────────────────┐
│ razorpay-payment-button.tsx         │
│                                      │
│ handler: async (response) => {      │
│   if (response.razorpay_payment_id) │
│     const res = await placeOrder()  │ ───┐
│     onOrderCompleted(res)            │    │
│ }                                    │    │
└─────────────────────────────────────┘    │
                                            │
                                            │ API Call
                                            │
FRONTEND (Data Layer)                       │
┌─────────────────────────────────────┐    │
│ cart.ts                              │    │
│                                      │    │
│ placeOrder() {                       │    │
│   sdk.store.cart.complete(cartId)   │ ◄──┘
│ }                                    │
└─────────────────────────────────────┘
                │
                │ HTTP POST /store/carts/:id/complete
                │
                ▼
BACKEND (Medusa API)
┌─────────────────────────────────────┐
│ Cart Complete Workflow               │
│                                      │
│ 1. Validate cart                     │
│ 2. Authorize payment ────────────┐  │
│ 3. Create order                  │  │
│ 4. Return order                  │  │
└─────────────────────────────────┼───┘
                                  │
                                  │
                ┌─────────────────┘
                │
                ▼
BACKEND (Razorpay Provider)
┌──────────────────────────────────────────┐
│ razorpay-base.js                          │
│                                           │
│ async authorizePayment(input) {          │
│   // Fetch payment from Razorpay         │
│   const status = await                   │
│     getPaymentStatus()                   │
│                                           │
│   // Check auto_capture option           │
│   if (status === AUTHORIZED &&           │
│       this.options_.auto_capture) {      │ ◄── auto_capture: true
│     status.status = CAPTURED;  ✓        │     from config
│   }                                       │
│                                           │
│   return { status: CAPTURED }            │
│ }                                         │
└──────────────────────────────────────────┘
                │
                │ Payment status updated
                │
                ▼
BACKEND (Database)
┌──────────────────────────────────────────┐
│ UPDATE payment_collection                │
│ SET status = 'captured',                 │
│     captured_amount = 1500               │
│ WHERE id = ...                           │
│                                           │
│ UPDATE payment_session                   │
│ SET status = 'captured'                  │
│ WHERE id = ...                           │
└──────────────────────────────────────────┘
```

---

## Configuration Impact Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  medusa-config.ts                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

modules: [
  {
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "medusa-plugin-razorpay-v2/...",
          id: "razorpay",
          options: {
            key_id: "...",
            key_secret: "...",
            auto_capture: true,  ◄────── THIS LINE
          }                                │
        }                                  │
      ]                                    │
    }                                      │
  }                                        │
]                                          │
                                           │
                                           │ Enables auto-capture
                                           │ in Razorpay provider
                                           │
        ┌──────────────────────────────────┘
        │
        ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Razorpay Provider                               ┃
┃  (medusa-plugin-razorpay-v2)                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

constructor(container, options) {
  this.options_ = options  ◄─── auto_capture: true
}

async authorizePayment(input) {
  const status = await getPaymentStatus()
  
  if (status === AUTHORIZED &&
      this.options_.auto_capture) {  ◄─── Checked here
    status.status = CAPTURED         ◄─── Auto-captured!
  }
  
  return { status }
}


        │
        │ Payment automatically captured
        │
        ▼

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Database State                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

payment_collection
├─ status: "captured"          ✓
├─ amount: 1500
├─ captured_amount: 1500       ✓
└─ authorized_amount: 1500

payment_session
├─ status: "captured"          ✓
└─ data: { razorpayOrder: {...} }


        │
        │ Reflected in UI
        │
        ▼

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Frontend Display                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

constants.tsx
└─ PAYMENT_STATUS_LABELS = {
     captured: "Paid",   ◄─── User-friendly label
     authorized: "Paid"
   }

Order Confirmation Page
└─ Badge: "Payment Successful" (green)
   Message: "We've received your payment"

Order Details Page
└─ Payment Status: "Paid" ✓

Admin Dashboard
└─ Payment Status: "Captured" ✓
   Total Paid: ₹1,500 ✓
   Outstanding: ₹0 ✓
```

---

## Edge Cases Handling

### 1. Payment Failure

```
Customer clicks Pay
     │
     ▼
Razorpay Modal
     │
     │ Payment fails (insufficient funds, etc.)
     ▼
razorpay.on('payment.failed')
     │
     ▼
Show error message
"Payment failed. Please try again."
     │
     ▼
Cart remains active
Customer can retry
```

### 2. Payment Dismissed

```
Customer clicks Pay
     │
     ▼
Razorpay Modal
     │
     │ Customer closes modal
     ▼
modal.ondismiss()
     │
     ▼
No order created
Cart remains active
Customer can retry
```

### 3. Network Error

```
Payment succeeds in Razorpay
     │
     ▼
placeOrder() called
     │
     │ Network error during API call
     ▼
catch (error)
     │
     ▼
Show error message
"Payment completed but finalizing your order failed."
     │
     ▼
Customer contacts support
Admin can verify payment in Razorpay dashboard
Admin manually creates order if needed
```

---

## Database Schema Changes

### Before Auto-Capture:

```sql
-- After payment authorization
payment_collection
├─ id: "paycol_xxxxx"
├─ status: "authorized"          ← Not yet captured
├─ amount: 1500
├─ captured_amount: 0            ← Nothing captured yet
├─ authorized_amount: 1500
└─ refunded_amount: 0

-- Admin must click "Capture Payment"
-- Then status changes to "captured"
-- Then captured_amount becomes 1500
```

### After Auto-Capture:

```sql
-- After payment authorization (immediate)
payment_collection
├─ id: "paycol_xxxxx"
├─ status: "captured"            ← Automatically captured ✓
├─ amount: 1500
├─ captured_amount: 1500         ← Full amount ✓
├─ authorized_amount: 1500
└─ refunded_amount: 0

-- No admin action needed
-- Payment immediately available for settlement
```

---

## Summary

**One Config Change** → **Complete Auto-Capture Flow**

```
auto_capture: true
       │
       ▼
Automatic Payment Capture
       │
       ▼
Better Customer Experience
       │
       ▼
Reduced Admin Workload
       │
       ▼
Faster Order Processing
```

