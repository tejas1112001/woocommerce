# Step-by-Step Guide: Add Product and See on Frontend

After database reset, follow these steps **in order** to add products and see them on your storefront.

---

## 🎯 Step 1: Start Backend Server

```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npm run dev
```

**Wait for:** Server should start on `http://localhost:9000`

**Check:** Browser should show Medusa API response

---

## 🎯 Step 2: Login to Medusa Admin

1. Open browser: `http://localhost:9000/app` or `http://localhost:5173` (Vite admin)
2. Login with your credentials:
   - Email: `tejas.shinde.office@gail.com` or `tejas.shinde.office@gmail.com`
   - Password: (your existing password)

**Success:** You should see the Medusa Admin Dashboard

---

## 🎯 Step 3: Create a Store

**Why:** Products need to be linked to a store

1. Go to **Settings** → **Stores**
2. Click **"Create Store"** or **"New Store"**
3. Fill in:
   - **Name:** `My Store` (or your store name)
   - **Default Currency:** `INR` (Indian Rupee) or `USD`
   - Click **Save**

**Success:** Store created

---

## 🎯 Step 4: Create a Region

**Why:** Products need shipping regions for pricing and delivery

1. Go to **Settings** → **Regions**
2. Click **"Create Region"** or **"New Region"**
3. Fill in:
   - **Name:** `India` or your region
   - **Currency:** `INR` (or your preferred currency)
   - **Tax Rate:** `18` (for GST) or `0`
   - **Countries:** Select countries (e.g., India)
   - **Payment Providers:** Select your payment method (e.g., Razorpay, Manual)
   - **Fulfillment Providers:** Select `manual` or your provider
4. Click **Save**

**Success:** Region created with currency and payment setup

---

## 🎯 Step 5: Create a Sales Channel

**Why:** Products must be assigned to a sales channel to be visible

1. Go to **Settings** → **Sales Channels**
2. Click **"Create Sales Channel"** or **"New Channel"**
3. Fill in:
   - **Name:** `Web Store` or `Online Store`
   - **Description:** `Main online storefront`
   - **Is Active:** ✓ (checked)
4. Click **Save**

**Success:** Sales channel created

---

## 🎯 Step 6: Create Shipping Options

**Why:** Products need shipping methods for checkout

1. Go to **Settings** → **Shipping**
2. Click **"Create Shipping Profile"** (if not exists)
   - Name: `Default Shipping`
3. Then click **"Add Shipping Option"**
4. Fill in:
   - **Name:** `Standard Delivery`
   - **Region:** Select the region you created (e.g., India)
   - **Price:** `100` (INR) or your shipping fee
   - **Fulfillment Provider:** `manual`
5. Click **Save**

**Success:** Shipping option created

---

## 🎯 Step 7: Create a Product Collection (Optional but Recommended)

**Why:** Helps organize products

1. Go to **Products** → **Collections**
2. Click **"Create Collection"**
3. Fill in:
   - **Title:** `T-Shirts` or your category
   - **Handle:** `t-shirts` (auto-generated)
4. Click **Save**

**Success:** Collection created

---

## 🎯 Step 8: Add Your First Product

1. Go to **Products** → Click **"New Product"**
2. Fill in **General Information:**
   - **Title:** `Sample T-Shirt`
   - **Subtitle:** `Comfortable cotton t-shirt`
   - **Handle:** `sample-t-shirt` (auto-generated)
   - **Description:** `High quality cotton t-shirt for everyday wear`
   - **Material:** `Cotton` (optional)

3. Fill in **Organize:**
   - **Collection:** Select your collection (e.g., `T-Shirts`)
   - **Type:** `Shirt` or `Apparel`
   - **Tags:** `casual, cotton` (optional)

4. Fill in **Variants:**
   - Click **"Add Option"**
   - **Option Name:** `Size`
   - **Values:** `S, M, L, XL` (add each)
   
   - Click **"Add Option"** again (optional)
   - **Option Name:** `Color`
   - **Values:** `Black, White, Blue`

5. Fill in **Pricing for each variant:**
   - For each variant (e.g., S/Black, M/Black):
     - **Price:** `999` (INR) or your price
     - **SKU:** `TSHIRT-S-BLK` (optional but recommended)
     - **Inventory:** `10` (quantity available)

6. **Sales Channels:**
   - ✓ Check **"Web Store"** (the channel you created)

7. **Thumbnail/Images:**
   - Click **"Upload Image"** or drag/drop product images
   - Add multiple images if you have them

8. Click **"Publish"** or **"Save"**

**Success:** Product created with variants

---

## 🎯 Step 9: Verify Product in Admin

1. Go to **Products** in admin
2. You should see your product: `Sample T-Shirt`
3. Click on it to verify:
   - ✓ All variants are there
   - ✓ Prices are set
   - ✓ Inventory is set
   - ✓ Sales channel is assigned
   - ✓ Status is **"Published"**

---

## 🎯 Step 10: Start Frontend/Storefront

Assuming you have a Medusa storefront (Next.js):

```bash
cd c:\self_learning\project\[your-storefront-folder]
npm run dev
```

**Common storefront ports:**
- Next.js Starter: `http://localhost:8000`
- Or your custom port

---

## 🎯 Step 11: View Product on Frontend

1. Open your storefront: `http://localhost:8000` (or your port)
2. Navigate to:
   - **Home page** → Should show products
   - **Products/Shop page** → Your product should be listed
   - **Product detail page** → Click on product to see details

**Success:** You should see:
- Product image
- Product title and description
- Price
- Size/Color variants (dropdown selectors)
- "Add to Cart" button

---

## 🎯 Step 12: Test Add to Cart

1. Select a variant (Size: M, Color: Black)
2. Click **"Add to Cart"**
3. Cart icon should update with item count
4. Click cart to view items

**Success:** Product added to cart

---

## 🎯 Step 13: Test Checkout (Optional)

1. Click **"Checkout"** or **"Go to Cart"**
2. Fill in:
   - Shipping address
   - Select shipping method (Standard Delivery - ₹100)
3. Choose payment method (Razorpay for test)
4. Complete the test order

**Success:** Order created and visible in Medusa Admin → Orders

---

## 🚨 Common Issues & Solutions

### Issue 1: Product not showing on frontend
**Solution:**
- ✓ Verify product is **Published** (not Draft)
- ✓ Verify product has **Sales Channel** assigned
- ✓ Verify product has **Inventory** > 0
- ✓ Refresh frontend page (Ctrl+F5)

### Issue 2: "No shipping options available"
**Solution:**
- Create shipping option in Settings → Shipping
- Assign it to the correct region
- Make sure region matches customer's address

### Issue 3: Can't add to cart
**Solution:**
- Check if variant has inventory > 0
- Check if price is set for the variant
- Check browser console for errors

### Issue 4: Product shows "Out of Stock"
**Solution:**
- Edit product → Go to variant
- Set inventory quantity > 0

---

## 📋 Quick Checklist

Before product shows on frontend, verify:
- ✅ Store created
- ✅ Region created with currency
- ✅ Sales channel created
- ✅ Shipping option created
- ✅ Product created
- ✅ Product has variants with prices
- ✅ Product has inventory > 0
- ✅ Product assigned to sales channel
- ✅ Product status is "Published"
- ✅ Frontend connected to backend API

---

## 🎉 You're Done!

Once you complete these steps, your product will be:
- ✓ Visible on frontend
- ✓ Available for purchase
- ✓ Ready for checkout

---

## 📝 Additional Resources

- **Admin Panel:** http://localhost:9000/app
- **API Docs:** http://localhost:9000/docs
- **Storefront:** http://localhost:8000 (or your port)

---

## 💡 Pro Tips

1. **Use Collections:** Organize products into collections for better navigation
2. **Add Images:** Always add product images for better user experience
3. **Set SKUs:** Helps with inventory management
4. **Test Orders:** Use Razorpay test mode for testing payments
5. **Check Inventory:** Always set inventory quantity before publishing

---

## 🆘 Need Help?

If stuck at any step:
1. Check Medusa Admin for errors
2. Check browser console (F12) for frontend errors
3. Check backend terminal for API errors
4. Verify all checkboxes in the checklist above

Good luck! 🚀
