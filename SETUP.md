# Developer & Client Project Setup Guide

This guide provides complete, step-by-step instructions to clone, configure, build, and run the **Swami Om Enterprises** e-commerce platform (Medusa Backend v2 + Next.js 16 Storefront) from scratch.

---

## 1. Prerequisites

Before installing, ensure your machine has the following tools installed:

* **Node.js**: `v20.x` or `v22.x` LTS (Required by `@medusajs/framework` `>=20` and Next.js).
* **Package Manager**: `npm` (`v10.x` or higher).
* **Database**: PostgreSQL (`v14` or higher) running locally or remotely.
* **Cache / Message Queue**: Redis (`v6` or higher) — *Optional for local dev, Required for production*.

### Detected Tech Stack & Versions

#### Backend (`medusa-backend/apps/backend`)
* **Framework**: Medusa Engine `v2.15.3` (`@medusajs/framework`, `@medusajs/medusa`, `@medusajs/cli`)
* **Monorepo Tools**: Turbo `v2.0.14`
* **Language**: TypeScript `v5.6.2`
* **Database Driver**: PostgreSQL (`pg` / `@medusajs/framework`)
* **Payment Plugin**: `medusa-plugin-razorpay-v2` (`v0.1.4`)
* **Admin Dashboard**: Medusa Admin Dashboard `v2.15.3` (`@medusajs/dashboard`)

#### Frontend Storefront (`solace-medusa-starter`)
* **Framework**: Next.js `v16.2.9` (App Router)
* **Language**: TypeScript `v5.7.2`
* **UI Library**: React `v19.2.7` / `@medusajs/ui` `v4.0.3` / Headless UI `v2.2.0` / Radix UI
* **Styling**: TailwindCSS `v3.4.17` / PostCSS / `tailwindcss-animate`
* **State Management**: Zustand `v5.0.2`
* **SDK**: Medusa JS SDK `v2.12.5` (`@medusajs/js-sdk`)
* **Payment Integration**: `react-razorpay` `v3.0.1`, `@stripe/stripe-js`, `@paypal/react-paypal-js`

---

## 2. Step-by-Step Clone & Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd project
```

### Step 2: Install Backend Dependencies
```bash
cd medusa-backend
npm install
cd ..
```

### Step 3: Install Frontend Storefront Dependencies
```bash
cd solace-medusa-starter
npm install
cd ..
```

---

## 3. Environment Variables Configuration

The project consists of two separate apps: the backend and the storefront. Each app requires its own environment file.

### A. Backend Environment File (`medusa-backend/apps/backend/.env.local`)

Copy `.env.template` to `.env.local` inside `medusa-backend/apps/backend/`:

```bash
cd medusa-backend/apps/backend
cp .env.template .env.local
```

#### Required Backend Variables

| Variable | Recommended Local Value / Description | Required |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` or `production` | Yes |
| `DATABASE_URL` | `postgres://postgres:password@localhost:5432/medusa-medusa-backend` (PostgreSQL connection string) | Yes |
| `REDIS_URL` | `redis://localhost:6379` (Redis cache connection string; optional in local dev) | Optional (Dev) / Yes (Prod) |
| `STORE_CORS` | `http://localhost:8000,http://127.0.0.1:8000` (Allowed Storefront CORS origins) | Yes |
| `ADMIN_CORS` | `http://localhost:5173,http://localhost:9000,http://127.0.0.1:9000` (Allowed Admin Dashboard CORS origins) | Yes |
| `AUTH_CORS` | `http://localhost:8000,http://localhost:9000,http://127.0.0.1:9000` (Allowed Auth API origins) | Yes |
| `JWT_SECRET` | Secret key used to sign JWT authentication tokens (e.g. `supersecret`) | Yes |
| `COOKIE_SECRET` | Secret key used to encrypt session cookies (e.g. `supersecret`) | Yes |
| `AUTH_MFA_ENCRYPTION_KEY` | 256-bit hexadecimal string for encrypting MFA credentials | Yes |
| `MEDUSA_ADMIN_ONBOARDING_TYPE` | Set to `default` | Yes |
| `RAZORPAY_TEST_KEY_ID` | Local test key from Razorpay dashboard (e.g., `rzp_test_SvUwfD1vWhwpVG`) | Yes (if testing Razorpay) |
| `RAZORPAY_TEST_KEY_SECRET` | Local test secret key from Razorpay dashboard | Yes (if testing Razorpay) |
| `RAZORPAY_TEST_ACCOUNT` | Optional Razorpay merchant account ID for multi-account route setups | Optional |
| `RAZORPAY_TEST_AUTO_EXPIRY_PERIOD` | Auto-expiry period in minutes (e.g., `15`) | Yes |
| `RAZORPAY_TEST_MANUAL_EXPIRY_PERIOD` | Manual expiry period in minutes (e.g., `30`, plugin enforces min 7200) | Yes |
| `RAZORPAY_TEST_WEBHOOK_SECRET` | Webhook verification secret string (e.g., `local_dev_webhook_secret`) | Yes |

*For production deployments (`.env.production`), use `RAZORPAY_ID`, `RAZORPAY_SECRET`, `RAZORPAY_ACCOUNT`, `RAZORPAY_WEBHOOK_SECRET` instead of the `RAZORPAY_TEST_*` prefixes.*

---

### B. Frontend Environment File (`solace-medusa-starter/.env.local`)

Copy `.env.example` to `.env.local` inside `solace-medusa-starter/`:

```bash
cd solace-medusa-starter
cp .env.example .env.local
```

#### Required Frontend Variables

| Variable | Local Development Value / Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `http://localhost:9000` (Medusa server URL) | Yes |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:8000` (Storefront URL) | Yes |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable Key generated from Medusa Admin Dashboard / Database | Yes |
| `NEXT_PUBLIC_DEFAULT_REGION` | `in` (Default 2-letter ISO country code) | Yes |
| `NEXT_PUBLIC_SHOP_NAME` | `Swami Om Enterprises` (Brand / Store Name) | Yes |
| `NEXT_PUBLIC_SHOP_DESCRIPTION` | `Swami Om Enterprises Online Store` | Yes |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_SvUwfD1vWhwpVG` (Razorpay Client Key ID) | Yes (for Razorpay) |
| `NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID` | `rzp_test_SvUwfD1vWhwpVG` (Fallback Razorpay Key ID) | Yes (for Razorpay) |
| `MEDUSA_ADMIN_BACKEND_URL` | `http://localhost:9000` (Used for server-side onboarding checks) | Yes |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | Optional |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key (if using Stripe) | Optional |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Client ID (if using PayPal) | Optional |
| `NEXT_PUBLIC_SPACE_DOMAIN` | CDN / Storage hostname for DigitalOcean Spaces or AWS S3 | Optional |

---

## 4. Database Setup & Seeding

1. **Create PostgreSQL Database**:
   Create a blank database in PostgreSQL (e.g. named `medusa-medusa-backend`):
   ```sql
   CREATE DATABASE "medusa-medusa-backend";
   ```

2. **Run Migrations**:
   Run Medusa database migrations to create the required database tables:
   ```bash
   cd medusa-backend/apps/backend
   npx medusa db:migrate
   ```

3. **Create Admin User**:
   Create an initial administrator account for the Medusa Dashboard:
   ```bash
   npx medusa user --email admin@example.com --password YourSecurePassword123!
   ```

4. **Seed Products & Categories**:
   Run the pre-configured seed scripts to populate products, variants, and store categories:
   ```bash
   # Seed the Swami T-shirt product & variants
   npx medusa exec src/scripts/seed-swami-tshirt.ts

   # Seed store product categories (from workspace root)
   node seed-categories.js
   ```

---

## 5. Development Run Commands

### Start Backend (`medusa-backend`)
The Medusa backend runs on **Port 9000** (API) and serves the Admin Dashboard UI.

```bash
# Option A: From workspace root or medusa-backend folder
cd medusa-backend
npm run dev

# Option B: Directly inside backend app
cd medusa-backend/apps/backend
npm run dev
```

* Backend API: `http://localhost:9000`
* Admin Dashboard: `http://localhost:9000/app` (or embedded dashboard)

---

### Start Frontend Storefront (`solace-medusa-starter`)
The Next.js Storefront runs on **Port 8000**.

```bash
cd solace-medusa-starter
npm run dev
```

* Storefront Website: `http://localhost:8000`

---

## 6. Production Build & Run Commands

### Backend Production Build & Start
```bash
cd medusa-backend/apps/backend

# 1. Build backend TypeScript code and Admin bundle
npm run build

# 2. Start production server
npm run start
```

### Frontend Storefront Production Build & Start
```bash
cd solace-medusa-starter

# 1. Build Next.js storefront bundle
npm run build

# 2. Start production storefront server on port 8000
npm run start
```

---

## 7. Hardcoded Client-Specific Values Inventory

If you are white-labeling or reusing this codebase for a new client, you must replace the following hardcoded client values across the codebase:

### 1. Brand Name & Descriptions
* **Current Value**: `Swami Om Enterprises` / `Swami Om` / `स्वामी ओम एन्टरप्रायझेस`
* **Locations**:
  * `solace-medusa-starter/.env.example`, `.env.local`, `.env.production` (`NEXT_PUBLIC_SHOP_NAME`)
  * `solace-medusa-starter/src/app/layout.tsx` (Default Metadata Title)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/about/page.tsx` (About Page heading & text)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/account/@dashboard/orders/invoice/[id]/page.tsx` (Invoice Header Fallback)
  * `solace-medusa-starter/src/modules/layout/templates/footer/index.tsx` (Copyright string)

### 2. Starter Template Reference ("Tejas")
* **Current Value**: `Tejas` / `tejas-medusa-starter`
* **Locations**:
  * `solace-medusa-starter/package.json` (`"name": "tejas-medusa-starter"`)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/page.tsx` (Title: `Tejas`)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/about/page.tsx` (Title: `About Us | Tejas`)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/contact/page.tsx` (Title: `Contact Us | Tejas`)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/collections/page.tsx` (Title: `Collections | Tejas`)
  * `solace-medusa-starter/src/app/[countryCode]/(main)/categories/[...category]/layout.tsx`
  * `solace-medusa-starter/src/app/[countryCode]/(main)/products/[handle]/page.tsx`
  * Components: `TejasLogo` & `TejasLogoBig` in `solace-medusa-starter/src/modules/common/icons/solace-logo.tsx` & `logo-solace-big.tsx`

### 3. Branding Logos & Favicons
* **Logos**:
  * `solace-medusa-starter/public/logo/logo.png`
  * `solace-medusa-starter/public/logo.png`
  * Referenced in `solace-logo.tsx` (`src="/logo/logo.png"`, `alt="Swami Om Enterprises Logo"`)
* **Favicons**:
  * `solace-medusa-starter/public/favicon/favicon.ico`
  * `solace-medusa-starter/public/favicon.ico`

### 4. Production Domain Names
* **Current Values**: `swamiomenterprises.in`, `www.swamiomenterprises.in`, `api.swamiomenterprises.in`
* **Locations**:
  * `solace-medusa-starter/next.config.js` (`images.remotePatterns`)
  * `solace-medusa-starter/.env.production`
  * `medusa-backend/apps/backend/.env.production` (`STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`)

### 5. Local Database Passwords & Credentials
* **Current Values**: User `postgres`, Passwords `tejas` or `KingKohli18`, DB `medusa-medusa-backend` or `medusa_db_swami`
* **Locations**:
  * `medusa-backend/apps/backend/.env.local`
  * Diagnostic scripts (`check-*-db.ts`, `query-test*.js`)

### 6. Payment Keys (Local Dev)
* **Razorpay Test Key ID**: `rzp_test_SvUwfD1vWhwpVG`
* **Razorpay Test Secret**: `7uC5Q5MGuUEKzq3kxthC1iDq`
* **Locations**: `.env.local` files in backend and storefront.

### 7. Demo Product Slugs & Seed Data
* **Current Values**: `swami-t-shirt`, `swami-printed-t-shirt`, SKUs matching `SWAMI-*`
* **Location**: `medusa-backend/apps/backend/src/scripts/seed-swami-tshirt.ts`

---

## 8. Additional Operational Steps

1. **Generate Publishable API Key**:
   * Open Medusa Admin Dashboard at `http://localhost:9000/app` (or login via backend).
   * Navigate to **Settings -> API Key Management -> Publishable API Keys**.
   * Create a new Publishable Key, attach it to your **Default Sales Channel**, and paste the key string into `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `solace-medusa-starter/.env.local`.

2. **Configure Razorpay Region Payment Provider**:
   * In Medusa Admin Dashboard, go to **Settings -> Regions**.
   * Edit the **India (in)** region (or default region).
   * Under **Payment Providers**, check and enable `razorpay`.

3. **Static File Upload Folder Permissions**:
   * Local file uploads are stored in `medusa-backend/apps/backend/static`. Ensure read/write permissions exist for the Node.js process on this directory.
   * Uploaded product images are served locally via `http://localhost:9000/static/<filename>`.

4. **CORS Alignment**:
   * If running the storefront on a non-default port or host, update `STORE_CORS` and `AUTH_CORS` in `medusa-backend/apps/backend/.env.local` accordingly.
