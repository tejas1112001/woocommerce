# E-Commerce Project — Medusa + Next.js

A full-stack headless e-commerce setup using **Medusa v2** as the backend and a **Next.js** storefront.

---

## Project Structure

```
project/
├── medusa-backend/         # Medusa v2 backend (monorepo via Turborepo)
│   └── apps/backend/
└── solace-medusa-starter/  # Next.js storefront
```

---

## Backend Stack

| Layer | Technology |
|---|---|
| Framework | [Medusa v2](https://medusajs.com) `2.15.3` |
| Language | TypeScript `^5.6.2` |
| Runtime | Node.js `>=20` |
| Database | PostgreSQL (via `DATABASE_URL`) |
| Monorepo | Turborepo `^2.0.14` |
| Package Manager | npm `10.8.2` |
| Testing | Jest `^29.7.0` + `@medusajs/test-utils` |
| Build Tool | Vite `^5.4.14` |

### Core Medusa Packages

| Package | Version | Purpose |
|---|---|---|
| `@medusajs/medusa` | `2.15.3` | Core commerce engine |
| `@medusajs/framework` | `2.15.3` | Framework utilities & config |
| `@medusajs/admin-sdk` | `2.15.3` | Admin panel SDK |
| `@medusajs/dashboard` | `2.15.3` | Built-in admin dashboard UI |
| `@medusajs/ui` | `4.1.13` | Medusa UI component library |
| `@medusajs/caching` | `2.15.3` | Caching module |
| `@medusajs/draft-order` | `2.15.3` | Draft order support |
| `@medusajs/cli` | `2.15.3` | Medusa CLI |

### Backend Plugins

| Plugin | Version | Purpose |
|---|---|---|
| `medusa-plugin-razorpay-v2` | `^0.1.4` | Razorpay payment gateway integration |

### Backend Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react-router-dom` | `6.30.3` | Routing for admin panel |
| `react-i18next` | `13.5.0` | Internationalization for admin |
| `@tanstack/react-query` | `5.64.2` | Server state management |
| `zod` | `4.2.0` | Schema validation |

---

## Frontend Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) `^16.1.1` |
| Language | TypeScript `^5.7.2` |
| Runtime | Node.js `>=24` |
| Styling | Tailwind CSS `3.4.17` |
| Package Manager | npm `>=10.0.0` |
| Linting | ESLint `^9.39.2` |
| Formatting | Prettier `3.3.3` |
| E2E Testing | Playwright `^1.51.1` |

### Medusa Frontend Packages

| Package | Version | Purpose |
|---|---|---|
| `@medusajs/js-sdk` | `^2.12.5` | Medusa JS client SDK |
| `@medusajs/types` | `^2.12.5` | Shared TypeScript types |
| `@medusajs/icons` | `^2.12.5` | Icon library |
| `@medusajs/ui` | `4.0.3` | UI component library |
| `@medusajs/ui-preset` | `2.3.1` | Tailwind preset for Medusa UI |

### Payment Integrations

| Package | Version | Purpose |
|---|---|---|
| `@stripe/react-stripe-js` | `3.1.1` | Stripe React components |
| `@stripe/stripe-js` | `5.5.0` | Stripe JS SDK |
| `react-razorpay` | `^3.0.1` | Razorpay React integration |
| `@paypal/react-paypal-js` | `8.8.1` | PayPal React components |
| `@paypal/paypal-js` | `8.1.3` | PayPal JS SDK |

### UI & Component Libraries

| Package | Version | Purpose |
|---|---|---|
| `@radix-ui/react-accordion` | `1.2.2` | Accessible accordion component |
| `@radix-ui/react-select` | `2.1.4` | Accessible select component |
| `@radix-ui/react-visually-hidden` | `1.1.1` | Accessibility utility |
| `@headlessui/react` | `2.2.0` | Headless accessible UI components |
| `embla-carousel-react` | `8.5.2` | Carousel / slider |
| `embla-carousel-autoplay` | `8.3.0` | Carousel autoplay plugin |
| `sonner` | `1.7.2` | Toast notifications |
| `next-themes` | `0.4.4` | Dark/light theme support |
| `next-nprogress-bar` | `2.3.13` | Page loading progress bar |
| `cva` | `1.0.0-beta.1` | Class variance authority (variant styling) |
| `tailwind-merge` | `2.6.0` | Merge Tailwind classes safely |
| `tailwindcss-animate` | `1.0.7` | Animation utilities |
| `tailwindcss-radix` | `3.0.5` | Radix UI Tailwind integration |

### Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `formik` | `2.4.6` | Form state management |
| `@hookform/error-message` | `2.0.0` | React Hook Form error display |
| `yup` | `1.4.0` | Schema-based form validation |
| `validator` | `^13.15.26` | String validation utilities |
| `zod` | (via backend) | Schema validation |

### State Management & Data Fetching

| Package | Version | Purpose |
|---|---|---|
| `zustand` | `5.0.2` | Lightweight global state management |
| `axios` | `^1.13.5` | HTTP client |

### Search

| Package | Version | Purpose |
|---|---|---|
| `algoliasearch` | `4.20.0` | Algolia search integration |

### Content & MDX

| Package | Version | Purpose |
|---|---|---|
| `@mdx-js/loader` | `3.0.1` | MDX webpack loader |
| `@mdx-js/react` | `3.0.1` | MDX React support |
| `@next/mdx` | `^16.1.1` | Next.js MDX plugin |
| `next-mdx-remote` | `6.0.0` | Remote MDX rendering |
| `react-markdown` | `9.0.1` | Markdown renderer |
| `remark-gfm` | `4.0.0` | GitHub Flavored Markdown |
| `rehype-highlight` | `7.0.0` | Syntax highlighting |
| `rehype-slug` | `6.0.0` | Auto-slug headings |

### Utilities

| Package | Version | Purpose |
|---|---|---|
| `lodash` | `^4.17.23` | Utility functions |
| `qs` | `^6.14.1` | Query string parsing |
| `dotenv` | `^16.4.7` | Environment variable loading |
| `react-intersection-observer` | `9.15.0` | Intersection Observer React hook |
| `react-country-flag` | `3.0.2` | Country flag components |
| `pg` | `8.11.3` | PostgreSQL client |
| `server-only` | `0.0.1` | Marks modules as server-only |
| `next-sitemap` | (via config) | Sitemap generation |

---

## Payment Providers

| Provider | Backend Plugin | Frontend Package |
|---|---|---|
| **Razorpay** | `medusa-plugin-razorpay-v2` | `react-razorpay` |
| **Stripe** | Medusa built-in | `@stripe/react-stripe-js`, `@stripe/stripe-js` |
| **PayPal** | Medusa built-in | `@paypal/react-paypal-js`, `@paypal/paypal-js` |

---

## Getting Started

### Backend

```bash
cd medusa-backend
npm install
npm run backend:dev
```

### Frontend

```bash
cd solace-medusa-starter
npm install
npm run dev       # runs on port 8000
```

### Environment Variables

- Backend: `medusa-backend/apps/backend/.env` (see `.env.template`)
- Frontend: `solace-medusa-starter/.env.local` (see `.env.example`)
