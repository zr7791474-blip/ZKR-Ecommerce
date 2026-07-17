<p align="center">
  <img src="https://img.shields.io/badge/ZKR-E--Commerce-1F6590?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe" />
  <img src="https://img.shields.io/badge/License-MIT-success" />
</p>

<p align="center">
  A production-ready, full-stack e-commerce platform built with Next.js 14, TypeScript, Prisma,
  PostgreSQL, NextAuth, and Stripe — real authentication, a real database-backed wishlist and
  cart, a working checkout, and an admin dashboard with real analytics, not placeholders.
</p>

---

## Overview

ZKR E-Commerce is a modern shopping platform designed to feel like a real commercial product —
Apple/Stripe/Linear-inspired UI, a light theme by default with a full dark "glass" theme
available as a toggle, and a genuinely functional backend behind every feature that looks
interactive.

Every feature listed below is implemented and wired end-to-end (frontend → server action or API
route → Prisma → PostgreSQL), not mocked. Where something isn't finished, it's marked as such
in [Roadmap](#roadmap) rather than presented as done.

---

## Tech Stack

| Category         | Technology                          |
|-------------------|--------------------------------------|
| Framework         | Next.js 14 (App Router)             |
| Language          | TypeScript (strict mode)            |
| UI                | React 18, Tailwind CSS, shadcn/ui   |
| Animation         | Framer Motion                       |
| Database          | PostgreSQL (Neon-compatible)        |
| ORM               | Prisma                              |
| Authentication    | NextAuth v4 (Credentials + Google + GitHub) |
| Payments          | Stripe Checkout                     |
| Email             | Resend                              |
| Forms             | React Hook Form + Zod               |
| State             | Zustand                             |
| Icons             | Lucide React, react-icons           |

---

## Features

### Authentication & Authorization
- Register, login, logout, "remember me"
- Forgot/reset password — real email delivery via Resend, single-use tokens, 1-hour expiry
- Email verification flow (`/verify-email`)
- Google & GitHub OAuth
- Role-based access (`CUSTOMER`, `EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`) enforced in
  middleware **and** re-verified server-side inside sensitive server actions (checkout, admin
  product mutations) — not just at the page level

### Shopping Experience
- Auto-rotating hero product showcase (keyboard nav, swipe, pagination, pause-on-hover)
- Live product search with debounced results, search history, trending searches, and match
  highlighting (⌘K / Ctrl+K)
- Product filtering, sorting, and pagination
- Wishlist — server-persisted per user, synced on login, never faked for guests (guests are
  routed to sign in rather than getting a fake local-only wishlist)
- Compare — side-by-side comparison of up to 4 products
- Share product — native Web Share API with clipboard fallback
- Flash Deals — only shows products with a genuine discount, with a live countdown
- Related products, recently viewed, and cart/checkout recommendations, all reading from one
  shared product data source

### Cart & Checkout
- Persistent cart with quantity controls, guest add-to-cart gating (redirects to sign in and
  returns the user to what they were doing)
- Checkout: shipping details, order summary, trust badges, real Stripe Checkout session
- Server-side auth re-check on the checkout API itself, not just the page route

### Orders
- Order history and detail pages (customer-facing and admin-facing)
- Public order tracking by order number + email (no login required, but authorization is
  verified against the order's actual account email)
- Real order status timeline (Placed → Paid → Processing → Shipped → Delivered)

### Account
- Profile editing (name, phone)
- Password change with real current-password verification
- Theme preference (light/dark)

### Admin Dashboard
- Real analytics: revenue, orders, customers, products, each with genuine month-over-month
  trend percentages computed from actual order data — not hardcoded numbers
- Real sales chart (last 12 months) and top-products list, both computed from real `Order`/
  `OrderItem` data
- Full product management: create, edit, soft-delete, with server-side role authorization on
  every mutation
- Orders list and detail view
- Sections not yet built (categories, coupons, reviews moderation, etc.) show an explicit
  "coming soon" state — never a 404, and never a fake table pretending to manage real data

### Content & Legal
- Real, complete pages for Privacy Policy, Terms of Service, Cookie Policy, FAQ, Shipping,
  Returns, Refund Policy, Help Center, Careers, Contact (with a working contact form that
  sends real email), About, Blog

### SEO & Infra
- `sitemap.xml`, `robots.txt`, per-page metadata
- Middleware-based route protection for account/admin/checkout areas

---

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Storefront pages
│   ├── (auth)/          # Login, register, password reset, email verification
│   ├── (admin)/admin/   # Admin dashboard
│   ├── account/         # Customer account area
│   ├── api/              # Route handlers (checkout, contact, search, auth)
│   └── layout.tsx
├── components/
│   ├── ui/               # Base design-system primitives
│   ├── ecommerce/        # Product cards, cart, wishlist, compare, etc.
│   ├── admin/             # Admin dashboard widgets
│   ├── account/           # Profile/password/preferences forms
│   ├── layout/             # Navbar, footer, mobile menu, search
│   └── legal/               # Shared legal-page layout, FAQ accordion
├── services/            # Server actions — Prisma access lives here
├── stores/               # Zustand client stores (cart, wishlist, compare)
├── hooks/                 # Shared client hooks (auth gate, recently viewed)
├── lib/                    # Auth config, email, validation schemas, demo data
└── prisma/                 # Schema, migrations, seed script
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```

At minimum you'll need a working `DATABASE_URL` and `AUTH_SECRET` to run the app. Stripe,
Resend, and OAuth credentials are required for checkout, transactional email, and social
login respectively — the app degrades gracefully without them (e.g. emails are skipped with a
console warning rather than crashing), but those features won't actually work until configured.

### 3. Set up the database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```
The seed script is idempotent (safe to re-run) and creates demo Admin/Customer/Employee
accounts plus a full product catalog generated from `public/products/`.

### 4. Run the dev server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

---

## Quality Checks

```bash
npx tsc --noEmit   # TypeScript strict check
npm run lint        # ESLint (next/core-web-vitals)
npm run build        # Production build
```

---

## Deployment (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add all variables from `.env.example` in the Vercel project settings, using production
   values (a real Neon connection string, a freshly generated `AUTH_SECRET`, live Stripe keys,
   etc.).
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.
4. Deploy.

---

## Roadmap

Honestly tracked — these are real gaps, not modesty:

- [ ] Admin: Categories, Brands, Inventory, Coupons, Reviews moderation, Users/Roles, Reports,
      Activity logs
- [ ] Product variants (color/size)
- [ ] Save-for-later in cart
- [ ] JSON-LD structured data
- [ ] Automated tests

---

## Author

**Zakariaa Adli (ZKR)**

- GitHub: [github.com/zr7791474-blip](https://github.com/zr7791474-blip)
- Email: [zr7791474@gmail.com](mailto:zr7791474@gmail.com)
- X: [x.com/zkr_ad](https://x.com/zkr_ad)
- WhatsApp: [wa.me/212657516301](https://wa.me/212657516301)

## License

MIT
