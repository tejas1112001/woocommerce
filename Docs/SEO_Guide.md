# CLAUDE.md: SEO Rules for [YOUR-STORE-DOMAIN]

**Place this file at the repo root.** Claude Code reads it automatically on every session.

**Scope:** these rules apply to any work that creates or edits a page, a route, a meta tag, a sitemap entry, a redirect, product/collection data, or page content. If a task touches any of those, follow this file. If a task is unrelated to pages, ignore it.

**Core principle:** a page Google cannot crawl, cannot index, or has already seen elsewhere (as a near-duplicate variant, filtered URL, or thin product listing) is worth nothing, no matter how good the product is. Fix crawlability and uniqueness first. Everything else is optimisation on top of that.

**Last verified against Google documentation:** July 2026. Re-verify the dated items in Appendix C every quarter.

---

# 0. Fill this in before Claude Code does anything

This file was generated as a template. The values below are placeholders — **never invent real values**. Replace every bracketed item, then delete this section.

```
Legal entity          [e.g. Shree Swami Samarth Devotional Products Pvt. Ltd. / Proprietorship name]
Brand name             Swami Om Enterprises
GSTIN                  [If registered — displays on wholesale/invoice pages, not required for SEO but should be real if shown]
Founded                [Year]
HQ                     Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur.
Phone / WhatsApp       7385677447, 9175253282, 9325883564
Email                  [Support email]
Domain                 swamiomenterprises.in
Instagram              [URL]
Facebook               [URL]
YouTube                [URL, if applicable — devotional content does well here]
Storefront framework   Next.js 16 (App Router), React 19, TypeScript
Commerce backend       Medusa.js v2.15.3 (headless), Node.js
Rendering strategy     [Confirm: ISR / SSG / SSR per route — see Section 6.7]
Search Console         [Verified property URL]
Analytics              [GA4 / GTM container ID]
```

**Do not guess the entity name, GSTIN, address, or founding year.** These appear in `Organization` schema (Section 7) and get cited by AI shopping assistants. A wrong legal name there is worse than no schema at all.

---

# 1. What this business is, and who buys from it

**We are a direct-to-consumer and wholesale e-commerce store for devotional and religious products**, centred on Shree Swami Samarth Maharaj and broader Hindu religious tradition: printed kurtas, napkins/uttarīya, metal photo frames and murtis, readymade dhotis, printed T-shirts, shawls, and related devotional items. We sell on our own website, not on a marketplace. We serve two buyer types on the same pages, and the site has to work for both:

| Buyer | What they're doing | What they need on the page |
|---|---|---|
| Individual devotee (retail) | Buying 1–2 pieces for personal puja, a gift, or a family occasion | Clear photos, fabric/material, size, price, delivery time, return policy, trust signals |
| Temple, mandal, pandal, or reseller (wholesale) | Buying in bulk for an utsav, a stall, or resale | MOQ, slab pricing, bulk order process, GST invoice, lead time, custom printing options if offered |

**Every product and category page should read as genuinely devotional and specific, not generic e-commerce filler.** Avoid stock phrases like "premium quality" or "best in class" with nothing behind them. Say what the product is for: which puja, which occasion, which fabric, whose image is printed, what the finish is.

## 1.1 The layered writing rule

Every page opens in plain, warm language a first-time visitor understands immediately, then gives the practical detail a buyer needs to decide.

```
Layer 1   What it is and who it's for. Plain language, no jargon, devotional context in one line.
Layer 2   Practical buying detail. Material, size, care, price basis, delivery, MOQ for wholesale.
```

Worked example:

> **Layer 1.** This printed cotton kurta carries Shree Swami Samarth Maharaj's image on the front, suited for darshan, utsav days, or everyday wear by a devotee.
>
> **Layer 2.** 100% cotton, screen-printed (not sublimation, so the print does not crack after repeated washing), available in sizes M to 5XL. Retail price shown includes GST. Wholesale slab pricing starts at 50 pieces — see the wholesale tab for per-piece rates.

**Writing rules that follow from this:**

- **Name the deity/tradition context accurately.** Do not attribute an image, mantra, or design to Shree Swami Samarth Maharaj or any tradition unless the product actually depicts or reflects it. Misattribution is both a trust problem and, at scale, a spam signal.
- **Give the practical fact and the devotional context together.** "Brass frame, hand-finished antique look, suitable for a home altar or gifting during Guru Pournima" serves both the emotional reason to buy and the practical detail.
- **Never open a product or category page with filler.** The first 100 words must say what the product is, who it's for, and one concrete detail (material, size range, or occasion).
- **Wholesale information belongs on the page, not buried in a PDF.** MOQ, slab pricing tiers, and how to place a bulk order should be visible text, not an image or a downloadable-only catalogue.
- **No fabricated urgency.** "Only 3 left" or "142 people viewing this" must reflect real Medusa inventory/session data or not appear at all. Fake scarcity is a trust violation and, per Section 7, a schema/spam risk if it touches structured data.

**Two tests before publishing. Both must pass:**

1. Would a first-time visitor, in the first two sentences, understand what the product is and whether it's for them?
2. Would a temple/mandal buyer looking at the same page find the wholesale path within one scroll?

If either answer is no, rewrite.

---

# 2. URL structure — decide this once, keep it fixed

Headless Medusa + Next.js gives full control over routing. Pick one structure and do not deviate without asking.

```
/                                    Homepage
/collections/[handle]                Category / collection (e.g. /collections/printed-kurtas)
/collections/[handle]/[product]      OR flat /products/[handle] — pick one pattern, see note below
/products/[handle]                   Product detail page
/search                              On-site search results (see Section 6.1 for indexability)
/pages/[slug]                        Editorial / devotional content pages (e.g. about Shree Swami Samarth Maharaj)
/blog, /blog/[slug]                  Blog index and posts
/wholesale                           Wholesale / bulk-order hub
/policies/shipping, /policies/returns,
/policies/privacy, /policies/terms   Legal and trust pages
/cart, /checkout, /account/*         Transactional, see Section 6.1 for indexability
```

**Pick either nested category URLs (`/collections/printed-kurtas/swami-samarth-cotton-kurta`) or flat product URLs (`/products/swami-samarth-cotton-kurta`) and use it everywhere.** Medusa lets a product belong to multiple collections, which makes nested URLs tempting but creates duplicate-URL risk if the same product is reachable under two category paths. If a product belongs to more than one collection, **flat `/products/[handle]` is the safer default** — categories then link to it rather than contain it in the URL. Do not build both patterns for the same product.

**Do not create a new top-level path segment without asking.**

---

# 3. Before creating any page

## 3.1 Cannibalisation check

```bash
grep -i "your target phrase" seo-audit/keyword-map.md
```

If a phrase is already claimed by another URL — most commonly a category page and a product page both targeting "swami samarth kurta" — **stop and report it**. Recommend one of:
- the category page targets the plural/broad phrase ("swami samarth kurtas"), the product page targets the specific one ("swami samarth printed cotton kurta")
- merge into one page and 301 the weaker URL
- retarget one to a distinct phrase

**Every product variant (size, colour) is the same product page, not a new URL, unless Medusa gives it a genuinely separate handle with materially different content.** Do not create `/products/kurta-red` and `/products/kurta-blue` as near-duplicates. Use variant selectors on one page, and let the canonical (Section 6.2) hold it together if the storefront ever does generate variant-specific URLs.

## 3.2 Read the siblings first

Before writing a new product or category description, read two existing ones in the same collection. You're writing to be different from them.

## 3.3 Confirm the internal linking plan

Name the pages that will link to this new page (its parent collection, the homepage/nav if featured, at least one blog post or the "related products" block) before shipping. An orphaned product page with no path from navigation, search, or another page is invisible to both users and Googlebot.

## 3.4 Declare the page type

Pick one from Section 10. Each type has different minimum content and schema rules.

## 3.5 If you are editing rather than creating

- **Update `dateModified` / a product's `updated_at` reflection only for a real content change**, not a price tweak that happens automatically via Medusa (price changes are expected and shouldn't force a fake "freshness" signal).
- **Never delete a product's description to "clean it up" once it's ranking or has sales history.** Add and restructure.
- **Do not change a product's URL handle once it has orders or backlinks** unless necessary. If you must, ship a 301 in the same commit and update Medusa's stored handle so Next.js regenerates correctly.
- **When a product goes out of stock, do not delete the page.** See Section 6.12 for the correct handling — deleting a page that Google has indexed and that has backlinks or sales history throws away SEO equity for no reason.

---

# 4. On-page SEO

## 4.1 Title tag

- Under 60 characters including the brand suffix
- Format: `Product/Category Name | Key Detail | [Brand Name]`
- Unique across the entire site — grep before setting it
- No "Best", "No.1", "Top Rated" unless demonstrably true and sourced

```
Good  Swami Samarth Printed Cotton Kurta | M–5XL | [Brand]
Good  Brass Photo Frames — Shree Swami Samarth | Wholesale & Retail | [Brand]
Bad   [Brand] - Best Devotional Products Online in India for All Occasions
Bad   Kurta (too vague, not unique)
```

## 4.2 Meta description

- 140–155 characters, written for a click
- State the product/category plus one concrete reason to click: price range, material, or "wholesale available"
- Never duplicated across products — this is the single most common e-commerce SEO failure, especially for near-identical variants

## 4.3 H1 and heading hierarchy

- Exactly one H1 per page, different from the title tag
- Product page H1 = the product name as a customer would say it, not the internal SKU name
- Category page H1 = the collection name, plain ("Printed Kurtas", not "Kurtas Category")
- Never skip levels

## 4.4 URL slug

- Lowercase, hyphen-separated, descriptive, no SKUs, no dates
- Generated from the product/collection name in Medusa, not hand-typed per page
- Never change a live slug without a 301 in the same commit

```
Good  /products/swami-samarth-printed-cotton-kurta
Good  /collections/readymade-dhotis
Bad   /products/sku-8827-red-m
```

## 4.5 Body content — minimum unique word counts

| Page type | Minimum unique words |
|---|---|
| Product page | 300 |
| Collection/category page | 500 |
| Wholesale hub | 600 |
| Blog post | 900 |
| Devotional/editorial page (e.g. "Who is Shree Swami Samarth Maharaj") | 800 |
| Policy page | No minimum — clarity over length |

- Short paragraphs, front-load the answer (what it is, who it's for) in the first 100 words
- Use a table for size charts and wholesale slab pricing, bullets for material/care specs, prose for the devotional/use-case framing
- Cite a real fact if you state one (a festival date, a tradition detail). Do not invent religious or historical claims.
- No em dashes. No "In today's fast-paced world" or any variant.

## 4.6 Internal links

- Every product links to its parent collection and 2–4 related products (same deity/occasion, or "frequently bought together" if Medusa surfaces that data — never fabricated)
- Every collection links to its child products and to sibling collections where relevant (e.g. "Printed Kurtas" links to "Shawls" under a festive-wear grouping)
- Descriptive anchor text always — "Shree Swami Samarth brass frames", never "click here" or "shop now" as the only link text
- Every link is a real `<a href>` via `next/link`. Never a `<div onClick>` for navigation — invisible to crawlers.

## 4.7 Images — the highest-effort item on this site

Devotional products sell on image quality and this is also usually the largest Core Web Vitals risk.

- Every image has a descriptive alt attribute: subject, material, angle — not the filename, not keyword-stuffed
- Explicit width and height on every image via `next/image`, never a raw `<img>`
- `priority` on the single largest above-the-fold image (usually the main product photo) only
- File names describe content: `swami-samarth-brass-frame-8inch-front.webp`, not `IMG_0234.webp`
- WebP or AVIF, under 200KB for content images, under 100KB where possible for thumbnail/grid images given how many render per category page
- Product galleries: render all images in the DOM (thumbnails + main), swap the visible one with CSS/state — do not lazy-fetch gallery images only on click if you want them indexed and counted toward page content
- Zoom/lightbox overlays must not block the base image from being crawlable in the initial DOM

## 4.8 What to never do on page

- Keyword stuffing ("swami samarth kurta buy online swami samarth kurta price" repeated)
- A separate near-duplicate page per colour/size variant
- Auto-generated product descriptions pulled verbatim from a supplier catalogue with no rewrite — Google treats catalogue-boilerplate descriptions as thin/duplicate content, and this is extremely common in e-commerce and a frequent cause of "Crawled — currently not indexed"
- Copying a competitor's product description, even reworded

---

# 5. Content uniqueness — the most common e-commerce SEO failure

## 5.1 The 60 percent rule

Every product page must have at least 60% unique body text versus its closest siblings (same collection, similar product). Shared nav, footer, size charts, and care-instruction boilerplate do not count toward this — but if the *only* thing that differs between two products is the product name, that page will not rank.

## 5.2 What must be written per product, never templated verbatim

- The opening description (Layer 1 in Section 1.1)
- The "who it's for / occasion" framing
- Material and care specifics *as they apply to this product* — do not paste a generic "cotton care" block onto a brass-frame page

## 5.3 Variant and filter duplication — the biggest risk on this stack

Medusa product variants (size, colour) and Next.js filter/sort UI on collection pages are the two most likely sources of duplicate or near-duplicate URLs on this site. See Section 6.3 for the technical fix. On the content side:

- Do not write separate descriptions per variant unless the variant is materially different (e.g. a size-XXL kurta needs no separate description; a "brass" vs "silver-plated" frame variant might)
- A filtered/sorted view of a collection (`?sort=price-asc`, `?color=red`) must never be treated as a new indexable page with its own title/meta — it's the same collection, filtered

## 5.4 Duplication check before shipping

```bash
node scripts/seo-duplication-check.mjs --page /products/new-product --against /collections/same-collection
```

If this script doesn't exist yet, write it before bulk-importing products from a supplier feed — bulk imports are exactly when duplicate boilerplate creeps in.

---

# 6. Technical SEO — the focus area for this build

This is a headless commerce stack (Next.js 16 App Router + Medusa.js v2.15.3 store API). Most GSC issues on stores like this come from four places: rendering, faceted navigation, out-of-stock handling, and sitemap accuracy. Get these right before anything else.

## 6.1 Indexability

- `<meta name="robots" content="index, follow">` on every public product, collection, blog, and policy page
- `noindex` on: `/cart`, `/checkout`, `/account/*`, `/search` results pages, any filtered/sorted collection URL (see 6.3), and any staging/preview deployment (see 6.11)
- Never combine `noindex` with a canonical pointing elsewhere — pick one
- Never put a `noindex` URL in the sitemap

## 6.2 Canonical tags

- Self-referencing, absolute, exact match to the live URL, on every product and collection page
- A product reachable via more than one collection path (if you ever allow that) must canonical to the single primary URL — see Section 2's flat-URL recommendation to avoid this problem entirely
- No trailing slash except root

```html
<link rel="canonical" href="https://[your-domain].com/products/swami-samarth-printed-cotton-kurta" />
```

## 6.3 Faceted navigation and filter/sort parameters — read this before building the collection UI

This is the single most common cause of e-commerce crawl-budget and duplicate-content problems, and it will happen on this site the moment collection pages get filters (size, colour, price range, sort order).

**Rules:**
- Filter and sort parameters (`?size=`, `?color=`, `?sort=`, `?page=` handled separately below) must **self-canonicalise to the base collection URL**, not to a parameter-stripped version pretending to be a different canonical — i.e., `/collections/printed-kurtas?color=red` should canonical to `/collections/printed-kurtas`
- Filtered URLs should be `noindex, follow` — Google can still crawl through them to discover products, but they don't compete with the base collection page for the same query
- **Never let a filter combination generate its own title tag and meta description as if it were a unique page.** If you want a specific filtered view to actually rank (e.g. "brass frames under ₹500" is a real search), that's a deliberate decision to build it as its own indexable collection with real unique content — not an accidental side effect of the filter UI
- Use query parameters for filters, not path segments, unless a specific filtered view has been deliberately promoted to a real page
- Configure this in `robots.txt` as a safety net but **do not rely on robots.txt alone** — a blocked-but-linked URL can still appear in search results without a snippet, which looks worse. Use `noindex` as the primary control; robots.txt disallow is a secondary crawl-budget measure for parameters Google shouldn't waste crawl time on at all (e.g. session/tracking params).

```
# robots.txt additions specific to this stack
Disallow: /cart
Disallow: /checkout
Disallow: /account/
Disallow: /search
Disallow: /*?sort=
Disallow: /*?ref=
Disallow: /*sessionid=
```

## 6.4 Pagination

- Real crawlable URLs (`/collections/printed-kurtas?page=2`), not a JavaScript-only "load more" with no URL state
- Each paginated page self-canonicals — do not canonical page 2 back to page 1
- If a collection is large enough to paginate, consider whether it should also be split into sub-collections (e.g. "Printed Kurtas" → "Printed Kurtas — Men" / "— Women" / "— Kids") for both UX and distinct indexable pages, rather than relying on pagination alone

## 6.5 Sitemap

- Generated dynamically from the Medusa Store API, not hand-maintained
- **Only published, in-stock-or-recently-in-stock products** with `status: published` in Medusa — draft, deleted, or archived products must not appear
- Real `lastmod` from Medusa's `updated_at` field per product/collection. Never the build timestamp.
- Regenerate on every product publish/unpublish, ideally via an ISR revalidation webhook from Medusa rather than a fixed cron, so the sitemap doesn't lag behind actual catalogue state
- Split into `sitemap-products.xml`, `sitemap-collections.xml`, `sitemap-blog.xml`, `sitemap-pages.xml`, referenced from a `sitemap-index.xml` — makes it far easier to diagnose indexing issues by content type in GSC

```bash
node scripts/seo-sitemap-check.mjs   # confirm no sitemap URL 404s, redirects, or is noindex
```

## 6.6 Redirects

- 301 for any permanent product/collection URL change (handle change, product merge, collection restructure)
- Ship the redirect in the same commit/deploy as the URL change
- No chains — if a product's handle changed twice, redirect straight to the current URL
- When a product is discontinued and merged into a similar one, 301 to that specific replacement product — never to the homepage or the generic collection

## 6.7 JavaScript rendering — critical on this stack

Next.js 16 App Router with Server Components is the right foundation for this, but it's easy to accidentally regress into client-only data fetching, especially against a Medusa store API.

- **Product title, price, description, availability, and images must be in the server-rendered HTML.** Fetch from the Medusa Store API in a Server Component or via `generateStaticParams`/ISR, not in a client-side `useEffect` that fires after hydration.
- **Price and stock status are the two fields most often fetched client-side "for freshness" — don't.** Server-render the price/availability at request or revalidation time (ISR with a short revalidate window, e.g. 60–300s, is usually the right balance for a catalogue that changes via admin actions), and only reconcile client-side for things like cart-quantity-aware stock checks at add-to-cart time.
- Variant selectors (size/colour swatches): render the default variant's full content server-side; client interactivity swaps the display, it shouldn't be the only way the content enters the DOM
- Accordion sections (size chart, care instructions, shipping info on the product page): render the text in the DOM, collapse with CSS/state, never conditionally render only on open

```bash
curl -s https://[your-domain].com/products/some-product | grep -E '<h1|price|in stock|canonical'
```

If price or the H1 is missing from that output, this rule has failed — fix it before anything else on that page.

## 6.8 Core Web Vitals

Field data targets, 75th percentile, mobile:

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| LCP | 2.5s or under | 2.5–4.0s | over 4.0s |
| INP | 200ms or under | 200–500ms | over 500ms |
| CLS | 0.1 or under | 0.1–0.25 | over 0.25 |

E-commerce-specific risks on this build:
- Category grid pages loading many product images at once — lazy-load everything below the fold, `priority` only on above-the-fold images
- Add-to-cart / variant-selector interactions causing layout shift — reserve space for price/stock-status text that changes on variant selection
- Filter UI re-rendering the whole product grid causing shift — reserve grid height or use a skeleton state
- Font loading for any Devanagari/Marathi text (product names, devotional copy) — `font-display: swap` and preload the font actually used above the fold

## 6.9 Out-of-stock and discontinued products

This is a recurring GSC problem for stores selling seasonal/festival items (Guru Pournima, Datta Jayanti stock spikes, for instance) where inventory genuinely runs to zero.

| Situation | What to do | Why |
|---|---|---|
| Temporarily out of stock, will restock | Keep page live, `index, follow`, show "out of stock" clearly in visible text and in `Offer` schema `availability` | Preserves rankings and sales history; Google explicitly supports this pattern |
| Out of stock, restock date known | Same as above, plus the date in visible text | Helps conversion, doesn't affect SEO directly |
| Permanently discontinued, similar product exists | 301 to the closest equivalent product | Passes link equity |
| Permanently discontinued, no replacement | 410 Gone, remove from sitemap | Google drops it faster than a 404; don't leave a live "sorry" page indexed |
| Seasonal (e.g. festival-specific item) | Keep indexed year-round if it will return; do not delete and recreate annually | Recreating the URL every year throws away all accumulated ranking signal |

**Never let an out-of-stock product silently become a soft 404** (page returns 200 but shows an empty/broken state). Always show real content: the product info, an out-of-stock notice, and related in-stock alternatives.

## 6.10 Soft 404s

- The actual 404 page must return HTTP 404, via `notFound()` from `next/navigation` in the App Router — not a client-side redirect to a "not found" component that still returns 200
- A product handle with no matching Medusa record must call `notFound()`
- An empty collection (all products currently out of stock or unpublished) should return 200 with a real "check back soon" state, not a blank grid

```bash
curl -o /dev/null -s -w "%{http_code}\n" https://[your-domain].com/products/this-does-not-exist
```

## 6.11 Preview and staging environments

Vercel/hosting preview URLs are publicly reachable by default and will get indexed as duplicate content if left unprotected.

```js
// middleware.ts
if (process.env.VERCEL_ENV !== 'production') {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
}
```

- Preview/staging serves `robots.txt` with `Disallow: /`
- Only the production domain is verified in Search Console
- Never link a preview URL from a public page or social post

## 6.12 HTTPS, headers, and mixed content

- Every URL over HTTPS, HTTP 301s to HTTPS
- Payment/checkout pages (via Medusa) especially must have zero mixed content
- `www` and non-`www` both resolve, one 301s to the other — pick the canonical form once and enforce it in `next.config.js`, the sitemap, and canonicals consistently
- Valid favicon at root, at least 48×48

## 6.13 Medusa-specific data integrity checks

- **Price shown must match Medusa's live price**, including any GST/tax handling — a stale ISR cache showing an old price is both an SEO trust issue (schema mismatch, Section 7) and a customer-facing pricing error
- **Currency is always INR** unless a real multi-region setup exists — do not add currency-switcher UI or region-based schema until that's actually built
- **Wholesale/bulk pricing, if shown as a separate price tier, must be labelled clearly** as such in both visible text and, if included, structured data — do not present a wholesale price as the default `Offer.price` for a retail search query

---

# 7. Structured data

## 7.1 Rules

- JSON-LD only
- Every field must match content visible on the page — this applies especially to `price` and `availability`, which must reflect live Medusa data, not a cached or stale value
- **Never fabricate `aggregateRating` or `review`.** Only add review schema when there are real, on-page, attributable customer reviews. Fake review markup is a fast route to a manual action, and for a devotional-goods store it's also a straightforward trust violation.
- Validate every new type at https://search.google.com/test/rich-results

## 7.2 What to use by page type

| Page type | Schema |
|---|---|
| Homepage | `Organization`, `WebSite` (with `SearchAction` if on-site search exists) |
| Any page with breadcrumbs | `BreadcrumbList` |
| Product page | `Product` with nested `Offer` (price, `priceCurrency: INR`, `availability`) |
| Collection page | `BreadcrumbList`, `CollectionPage` or `ItemList` optional |
| Blog post | `Article` or `BlogPosting` |
| Policy pages | none needed beyond `BreadcrumbList` |
| Contact / wholesale enquiry page | `Organization` with `ContactPoint` |

## 7.3 Deprecated — never add these

| Type | Status |
|---|---|
| `HowTo` | Rich results removed September 2023 |
| `FAQPage` | Rich results retired 7 May 2026 for all sites. Still valid schema.org, causes no harm, but adds it expecting no search feature — write good visible FAQ content instead |
| `Book Actions`, `Course Info`, `ClaimReview`, `Estimated Salary`, `Learning Video`, `Special Announcement`, `Vehicle Listing` | Retired June 2025 |

## 7.4 Product schema example

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Swami Samarth Printed Cotton Kurta",
  "image": [
    "https://[your-domain].com/images/swami-samarth-kurta-front.webp",
    "https://[your-domain].com/images/swami-samarth-kurta-back.webp"
  ],
  "description": "Screen-printed cotton kurta featuring Shree Swami Samarth Maharaj, available M to 5XL.",
  "sku": "[from Medusa variant SKU]",
  "brand": { "@type": "Brand", "name": "[Your brand name]" },
  "offers": {
    "@type": "Offer",
    "url": "https://[your-domain].com/products/swami-samarth-printed-cotton-kurta",
    "priceCurrency": "INR",
    "price": "[live price from Medusa, no placeholder in production]",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

**Populate `price` and `availability` from the same server-side Medusa fetch that renders the visible price — never a separate hardcoded value.** Two sources of truth for price is how this schema goes stale and starts failing GSC's Merchant/Product results validation.

## 7.5 Organization schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Your brand name]",
  "legalName": "[Legal entity name]",
  "url": "https://[your-domain].com",
  "logo": "https://[your-domain].com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[+91 ...]",
    "contactType": "customer service"
  },
  "sameAs": [
    "[Instagram URL]",
    "[Facebook URL]",
    "[YouTube URL, if applicable]"
  ]
}
```

---

# 8. AI search and AI shopping

## 8.1 The honest position

Google's official guidance (published 15 May 2026, updated 10 July 2026) states that optimising for generative AI search is still SEO — AI Overviews and AI Mode, including AI Mode's shopping features, run on the same index as classic Search via retrieval-augmented generation and query fan-out. **Everything in Sections 4–7 of this file is the AI search strategy.** There's no separate file or trick that unlocks citation or inclusion in AI shopping results.

## 8.2 What actually helps for a store like this

- **Accurate, structured product data** (Section 7) — AI shopping surfaces pull directly from Product/Offer schema and the same Merchant-quality signals as Google Shopping
- **Specific, non-generic descriptions.** "This kurta is worn for Guru Pournima and other Swami Samarth utsav days, screen-printed so the design doesn't crack after washing" is retrievable and quotable. "Premium quality kurta for all occasions" is not.
- **Real detail an AI couldn't assemble from a supplier catalogue alone** — the actual print method, the actual fabric weight, genuine care instructions, genuine wholesale terms
- **Entity clarity** — consistent brand name, address, and contact info everywhere (Section 9), so an AI system trusts who's speaking
- **Clean crawler access** — confirm `robots.txt` allows `Googlebot`, `Google-Extended`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Bingbot`, `Applebot-Extended` unless there's an explicit business decision to block one. Never block any of these without approval.

## 8.3 What to ignore

- `llms.txt` — not used by Google Search
- Rewriting content "for AI" separately from writing it well for people
- Adding schema beyond what's accurate, hoping it improves AI citation — it doesn't; Google is explicit that structured data isn't required for generative features

---

# 9. Local and national trust signals

The business is based in Pune and sells nationally (and potentially to the diaspora). This is not a walk-in local business, so the goal is entity consistency and trust, not map-pack ranking — except for wholesale buyers who may search locally ("swami samarth murti wholesale Pune").

## 9.1 NAP consistency

Name, address, and phone must be byte-identical across the website, Google Business Profile (if claimed), Instagram/Facebook bios, and schema markup.

## 9.2 What to implement in code

- `Organization` schema with real `address` and `contactPoint` (Section 7.5)
- A real contact/wholesale-enquiry page with the address in HTML text, not inside an image
- Consistent `sameAs` list

## 9.3 What sits outside the repo — flag to the business owner

- Google Business Profile: claimed, verified, correct category (e.g. "Religious goods store"), real photos
- Genuine customer review generation and response
- Listings on IndiaMart/Justdial/TradeIndia if wholesale is a real acquisition channel — flag, don't build
- Google Merchant Center product feed, if Shopping ads or free listings are wanted — this is a separate feed from the sitemap and has its own approval process; flag as a business decision

---

# 10. Page type recipes

## 10.1 Product page, `/products/[handle]`

```
Minimum 300 unique words
H1: product name as a customer would say it
Sections: hero (gallery + price + variant selector + add to cart, all server-rendered),
          description (Layer 1 + Layer 2 from Section 1.1), material & care,
          size chart (if apparel), wholesale note/CTA, related products, reviews (if real)
Schema: Product with Offer, BreadcrumbList
Inbound links: parent collection, homepage/nav if featured, 1+ related product
Outbound links: parent collection, 2+ related products
```

## 10.2 Collection page, `/collections/[handle]`

```
Minimum 500 unique words
H1: the collection name
Sections: intro (what this collection covers, who it's for), the product grid,
          a size/material guide relevant to this category, FAQ (visible content, no FAQPage rich-result expectation), CTA to wholesale if relevant
Schema: BreadcrumbList, CollectionPage optional
Filter/sort URLs: noindex, self-canonical to base collection (Section 6.3)
```

## 10.3 Wholesale hub, `/wholesale`

```
Minimum 600 unique words
Sections: who this is for, MOQ and slab pricing structure, how to place a bulk order,
          lead times, GST invoicing, sample product categories with links
Schema: BreadcrumbList
Must link to: relevant collections, contact/enquiry form
```

## 10.4 Blog post, `/blog/[slug]`

```
Minimum 900 unique words
Real author, publish date, modified date — both real
Direct-answer opening under the H1
Schema: Article/BlogPosting with author, datePublished, dateModified
Inbound links: blog index, 1–2 related posts, 1+ relevant product/collection
Outbound links: 1–2 product/collection pages in the body text
```

Good topics for this store: explaining a festival or tradition (Guru Pournima, Datta Jayanti), how to choose the right size/material, care instructions in depth, the significance of specific items (why a metal frame vs. a printed poster for an altar). Avoid thin "top 10 gift ideas" listicles with no real substance.

## 10.5 Devotional/editorial pages, `/pages/[slug]`

```
Minimum 800 unique words
E.g. "Who is Shree Swami Samarth Maharaj", "About us"
Written with genuine care and accuracy — this content builds trust and is often the first page a new devotee-customer reads
No invented historical or religious claims
Schema: BreadcrumbList
```

---

# 11. Off-page

## 11.1 What code controls

- Never break an inbound link — any URL change ships with a 301 in the same commit
- `sameAs` accuracy in Organization schema
- Consistent brand name in title suffix, `og:site_name`, and schema
- Real crawlable outbound links to any source cited (a festival date source, a tradition reference)
- Working social share links on product/blog pages, passing the actual page URL

## 11.2 What to flag, not build

- Backlinks from genuine devotional community sites, temple websites, or spiritual-content publications
- Real customer testimonials and reviews, collected and displayed with permission
- IndiaMart/TradeIndia/Justdial wholesale listings
- Instagram/YouTube devotional content that links back to the store

## 11.3 Never do

- Buy links or exchange links reciprocally at scale
- Comment/forum link drops on unrelated sites
- Bulk low-quality directory submissions
- Chase "AI mentions" through inauthentic placements

---

# 12. Pre-publish checklist

**Crawl and index**
- [ ] Returns 200, `index, follow`, self-referencing canonical
- [ ] In the sitemap with a real `lastmod`
- [ ] Not blocked in robots.txt
- [ ] HTTPS, no mixed content
- [ ] If replacing an old URL, 301 shipped in the same commit

**Rendering (Section 6.7)**
- [ ] H1, price, and availability all appear in `curl` output — not only client-rendered
- [ ] Product description appears in `curl` output

**On page**
- [ ] Title under 60 chars, unique sitewide
- [ ] Meta description 140–155 chars, unique sitewide
- [ ] One H1, different from title
- [ ] Meets minimum word count for its page type (Section 10)

**E-commerce specific**
- [ ] Price and availability in schema match the visible, live price
- [ ] No fabricated reviews, ratings, or urgency claims
- [ ] Out-of-stock handled per Section 6.9, not deleted or soft-404'd
- [ ] Variant/filter URLs don't create duplicate indexable pages (Section 6.3)

**Media**
- [ ] Every image has real alt text, width, height
- [ ] `next/image`, no raw `<img>`
- [ ] `priority` on the LCP image only

**Schema**
- [ ] Correct type for the page type, every field matches visible content
- [ ] No deprecated type added
- [ ] Validates in the Rich Results Test

**Facts**
- [ ] No invented client names, statistics, certifications, or religious/historical claims
- [ ] GSTIN/legal entity name, if shown, is real

---

# 13. When traffic or indexing drops

Work through this in order.

1. **Did something break?**
```bash
curl -o /dev/null -s -w "%{http_code}\n" https://[your-domain].com/affected-page
curl -s https://[your-domain].com/affected-page | grep -E 'robots|canonical'
curl -s https://[your-domain].com/robots.txt
```
Look for an accidental `noindex`, a wrong canonical, a new `Disallow`, a redirect, a 500, or a Medusa data fetch silently failing and rendering an empty page.

2. **One page or the whole site?** GSC Performance, compare periods, group by page. A whole-collection drop often means a filter/sort change accidentally started generating indexable duplicate URLs (Section 6.3) — check recent deploys to the collection page component first.

3. **Check GSC alerts.** Manual Actions, Security Issues, and the Pages report — especially watch for "Duplicate without user-selected canonical" spiking after a product-import or filter-UI change, and "Product" rich result errors if a schema/price mismatch shipped.

4. **Out-of-stock spikes.** If a seasonal product (e.g. a festival-specific item) went out of stock and traffic dropped, confirm it followed Section 6.9 rather than being deleted or returning a soft 404.

Log every incident in `seo-audit/incidents.md`.

---

# 14. Never do this

1. Ship a page with no inbound internal links
2. Change a live product/collection URL without a 301 in the same commit
3. Put a redirecting, 404, or `noindex` URL in the sitemap
4. Fabricate a review, rating, testimonial, statistic, or certification
5. Add `aggregateRating` for reviews that don't exist
6. Add `HowTo` or `FAQPage` schema expecting a search result feature
7. Copy a supplier's product description verbatim
8. Hide product price, availability, or description behind client-only JavaScript
9. Create a separate near-duplicate page per colour/size variant
10. Let filter/sort parameters generate their own indexable, non-canonical pages
11. Delete an out-of-stock product page instead of following Section 6.9
12. Let a "not found" or empty state return HTTP 200
13. 301 a discontinued product to the homepage when a real replacement exists
14. Use the build timestamp as a sitemap `lastmod`
15. Add or remove AI crawler rules in robots.txt without approval
16. Block CSS, JavaScript, or product images in robots.txt
17. Show a wholesale price as the default retail `Offer.price` in schema
18. Misattribute an image, design, or claim to a deity or tradition it doesn't actually depict
19. Claim "best" or "No.1" on-site without a real, sourced basis
20. Introduce a new top-level URL path without asking

---

# Appendix A: verification commands

```bash
# Rendered HTML check — the most useful single test
curl -s https://[your-domain].com/products/some-product | grep -E '<h1|price|canonical|robots'

# Confirm price/availability match live Medusa data, not a stale cache
curl -s https://[your-domain].com/products/some-product | grep -A2 '"@type": "Offer"'

# Sitemap health — no redirects, no 404s, no noindex URLs
node scripts/seo-sitemap-check.mjs

# Duplication check for a newly imported/bulk-added product
node scripts/seo-duplication-check.mjs --page /products/new-product --against /collections/same-collection

# Confirm a filtered collection URL is noindex and self-canonicals to the base
curl -s "https://[your-domain].com/collections/printed-kurtas?color=red" | grep -E 'robots|canonical'

# Confirm a missing product returns real 404
curl -o /dev/null -s -w "%{http_code}\n" https://[your-domain].com/products/this-does-not-exist

# Mixed content check
curl -s https://[your-domain].com | grep -o 'http://[^"]*' | grep -v 'schema.org\|w3.org'

# Confirm preview deployments are not indexable
curl -sI https://your-branch.vercel.app | grep -i 'x-robots-tag'
```

---

# Appendix B: quick reference

| Item | Value |
|---|---|
| Title tag | Under 60 characters |
| Meta description | 140–155 characters |
| Product page min words | 300 |
| Collection page min words | 500 |
| Blog post min words | 900 |
| Unique content minimum | 60% versus siblings |
| LCP | 2.5s or under |
| INP | 200ms or under |
| CLS | 0.1 or under |
| Content image size | Under 200KB |
| Currency | INR only, unless multi-region is deliberately built |

---

# Appendix C: dated facts, re-verify quarterly

| Fact | Date | Source |
|---|---|---|
| Google AI optimization guide published | 15 May 2026, updated 10 July 2026 | developers.google.com/search/docs/fundamentals/ai-optimization-guide |
| Google states AEO and GEO are still SEO | May 2026 | Same guide |
| Google states `llms.txt` is not used by Search | May 2026 | Same guide, mythbusting section |
| FAQ rich results retired for all sites | 7 May 2026 | Google FAQPage documentation |
| HowTo rich results removed | September 2023 | Google HowTo documentation |
| Seven structured data types retired | June 2025 | Google Search Central |
| INP replaced FID | March 2024 | web.dev |

**Re-verify every quarter.** If a rule here conflicts with current Google documentation, Google's documentation wins. Update this file and note the date.
