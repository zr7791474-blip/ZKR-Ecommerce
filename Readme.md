# ZKR E-Commerce

A modern full-stack e-commerce platform for browsing products, managing carts, and processing payments. Built with a scalable architecture using Next.js 14 App Router, Prisma, PostgreSQL, and NextAuth.

---

<p align="center">
  <img src="public/logo.png" alt="ZKR E-Commerce Logo" width="140" />
</p>

<p align="center">
  A production-ready, full-stack e-commerce platform built with Next.js 14, TypeScript, Prisma,
  PostgreSQL, NextAuth, and Stripe.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge" />
</p>

---

## Demo

**Live Website:**  
<LINK>

**Admin Panel:**  
<LINK>

**API:**  
<LINK>

### Demo Accounts

| Role  | Email | Password |
|------|------|----------|
| Super Admin | admin@zkrstore.com | Admin123! |
| Customer | customer@zkrstore.com | Customer123! |
| Viewer (Employee) | viewer@zkrstore.com | Viewer123! |

---

## Screenshots

| Hero Section | Featured Products |
|----------|----------|
| ![Hero](screenshots/Hero.JPG) | ![Featured Products](screenshots/Featured%20Products.JPG) |

| Products Listing | Blog |
|----------|----------|
| ![Products](screenshots/Products.JPG) | ![Blog](screenshots/Blog.JPG) |

| Login | Register |
|----------|----------|
| ![Login](screenshots/Login.JPG) | ![Register](screenshots/Register.JPG) |

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Main Pages](#main-pages)
- [User Roles & Permissions](#user-roles--permissions)
- [API Overview](#api-overview)
- [Performance Optimizations](#performance-optimizations)
- [Security Features](#security-features)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Future Improvements](#future-improvements)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About the Project

ZKR E-Commerce is a modern shopping platform designed to feel like a real commercial product — Apple/Stripe/Linear-inspired UI, a light theme by default with a full dark "glass" theme available as a toggle, and a genuinely functional backend behind every feature.

The platform includes secure authentication, role-based access control, persistent cart and wishlist, real Stripe checkout, order tracking, and a comprehensive admin dashboard with real analytics.

---

## Features

### Core Features
- Secure authentication using NextAuth v4 (Credentials + Google + GitHub OAuth)
- Role-based access control (Customer, Employee, Manager, Admin, Super Admin)
- Product browsing with advanced search, filtering, and sorting
- Persistent cart with quantity controls
- Server-persisted wishlist synced across devices
- Product comparison (up to 4 products side-by-side)
- Flash deals with live countdown
- Recently viewed products

### Checkout & Orders
- Real Stripe Checkout integration
- Shipping details and order summary
- Order history and detail pages
- Public order tracking by order number + email
- Real order status timeline (Placed → Paid → Processing → Shipped → Delivered)

### Admin Dashboard
- Real analytics: revenue, orders, customers, products
- Month-over-month trend percentages from actual data
- Sales chart (last 12 months)
- Top products list
- Full product management (create, edit, soft-delete)
- Orders management

### User Account
- Profile editing (name, phone)
- Password change with current-password verification
- Theme preference (light/dark)
- Email verification flow
- Forgot/reset password with real email delivery

### Content & Legal
- Privacy Policy, Terms of Service, Cookie Policy
- FAQ, Shipping, Returns, Refund Policy
- Help Center, Careers, Contact (working contact form)
- About, Blog pages

### SEO & Infrastructure
- sitemap.xml, robots.txt
- Per-page metadata
- Middleware-based route protection

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript (strict mode)

### Backend
- Next.js API Routes
- Server Actions

### Database
- PostgreSQL (Neon-compatible)
- Prisma ORM

### Authentication
- NextAuth v4

### Styling
- Tailwind CSS 3.x
- shadcn/ui components

### Animation
- Framer Motion

### State Management
- Zustand

### Forms & Validation
- React Hook Form
- Zod

### Payments
- Stripe Checkout

### Email
- Resend

### UI Icons
- Lucide React
- react-icons

---

## Architecture Overview

The system follows a modular full-stack architecture:

- **Presentation Layer**: Next.js App Router UI with Server & Client Components
- **Business Layer**: Server Actions & API Routes
- **Data Layer**: Prisma ORM + PostgreSQL
- **Auth Layer**: NextAuth v4 with middleware protection
- **State Layer**: Zustand for client-side state
- **Payment Layer**: Stripe Checkout integration

---

## Folder Structure

```bash
ZKR-Ecommerce/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── logo/
│   ├── products/
│   └── screenshots/
├── src/
│   ├── app/
│   │   ├── (public)/          # Storefront pages
│   │   ├── (auth)/            # Login, register, password reset
│   │   ├── (admin)/admin/     # Admin dashboard
│   │   ├── account/           # Customer account area
│   │   ├── api/               # Route handlers
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                # Base design-system primitives
│   │   ├── ecommerce/         # Product cards, cart, wishlist
│   │   ├── admin/             # Admin dashboard widgets
│   │   ├── account/           # Profile forms
│   │   ├── layout/            # Navbar, footer, mobile menu
│   │   └── legal/             # Legal page layouts
│   ├── services/              # Server actions (Prisma access)
│   ├── stores/                # Zustand stores (cart, wishlist)
│   ├── hooks/                 # Shared client hooks
│   ├── lib/                   # Auth config, email, validation
│   └── middleware.ts
└── package.json
```

---

## Installation

```bash
git clone <YOUR_REPOSITORY_URL>
cd ZKR-Ecommerce
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Authentication
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (optional for checkout)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (optional for transactional emails)
RESEND_API_KEY="re_..."

# OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

Generate AUTH_SECRET:

```bash
openssl rand -base64 32
```

---

## Running Locally

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm run start
```

Quality checks:

```bash
npx tsc --noEmit    # TypeScript strict check
npm run lint         # ESLint
npm run build        # Production build
```

---

## Database Setup

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed demo data
```

### Models

- User (with roles: CUSTOMER, EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN)
- Product
- Category
- Order
- OrderItem
- Cart
- Wishlist
- Compare
- Review
- Address
- PasswordResetToken
- EmailVerificationToken

---

## Authentication

- Credentials-based login with email verification
- OAuth providers: Google & GitHub
- Session-based auth with NextAuth
- Role-based access control
- Protected routes via middleware
- Server-side re-verification in sensitive actions
- Forgot/reset password with single-use tokens (1-hour expiry)
- "Remember me" functionality

---

## Main Pages

### Public
- Home (with auto-rotating hero showcase)
- Products (listing with search, filters, pagination)
- Product Details (with related products, reviews)
- Flash Deals
- Cart & Checkout
- Order Tracking

### Authentication
- Login
- Register
- Forgot Password
- Reset Password
- Email Verification

### Account
- Dashboard
- Profile Settings
- Order History
- Order Details
- Wishlist
- Compare
- Theme Preferences

### Admin
- Dashboard (analytics, charts)
- Products Management
- Orders Management
- Users Management (coming soon)
- Categories (coming soon)
- Reports (coming soon)

### Legal & Content
- Privacy Policy
- Terms of Service
- Cookie Policy
- FAQ
- Shipping Policy
- Returns & Refunds
- Help Center
- Contact Us
- About Us
- Careers
- Blog

---

## User Roles & Permissions

| Role  | Permissions |
| ----- | ----------- |
| **Customer** | Browse products, add to cart, checkout, view orders, manage wishlist, compare products |
| **Employee** | View orders, basic product management |
| **Manager** | Manage products, view analytics, manage orders |
| **Admin** | Full product & order management, user management, analytics |
| **Super Admin** | Complete system control, role management, all features |

---

## API Overview

- `/api/auth/*` - Authentication endpoints
- `/api/checkout` - Stripe checkout session creation
- `/api/products` - Product CRUD & search
- `/api/cart` - Cart management
- `/api/wishlist` - Wishlist operations
- `/api/compare` - Product comparison
- `/api/orders` - Order creation & retrieval
- `/api/contact` - Contact form submission
- `/api/search` - Global search with suggestions

---

## Performance Optimizations

- Next.js Server Components for reduced client bundle
- Image optimization with Next.js Image component
- Lazy loading for below-fold content
- Efficient Prisma queries with selective field loading
- Server-side rendering (SSR) for SEO-critical pages
- Debounced search to reduce API calls
- Pagination for large datasets
- Cached product data where appropriate

---

## Security Features

- NextAuth secure session management
- Middleware-based route protection
- Server-side authorization re-check on sensitive actions
- Password hashing with bcrypt
- Input validation with Zod schemas
- Role-based authorization at API and action level
- CSRF protection via NextAuth
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping
- Secure HTTP headers

---

## Responsive Design

- Mobile-first UI approach
- Tablet & desktop optimized layouts
- Adaptive navigation (hamburger menu on mobile)
- Responsive product grids
- Touch-friendly interfaces
- Adaptive dashboards

---

## Accessibility

- Semantic HTML5 elements
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Color contrast compliance (WCAG AA)
- Screen reader friendly
- Skip to content links

---

## Future Improvements

- [ ] Admin: Categories, Brands, Inventory, Coupons, Reviews moderation
- [ ] Product variants (color/size)
- [ ] Save-for-later in cart
- [ ] JSON-LD structured data for SEO
- [ ] Automated tests (unit & E2E)
- [ ] Email notifications for order updates
- [ ] Multi-currency support
- [ ] Product reviews & ratings system
- [ ] Advanced analytics & reporting
- [ ] Export orders to CSV/PDF

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables from `.env.example`
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to production domain
5. Deploy

```bash
npm run build
```

### Other Platforms

- Railway
- Supabase + Vercel
- AWS Amplify
- Netlify

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

MIT License

---

## Author

**Zakariaa Adli (ZKR)**

- GitHub: [github.com/zr7791474-blip](https://github.com/zr7791474-blip)
- Email: [zr7791474@gmail.com](mailto:zr7791474@gmail.com)
- X (Twitter): [x.com/zkr_ad](https://x.com/zkr_ad)
- WhatsApp: [wa.me/212657516301](https://wa.me/212657516301)

---

## Contact

For inquiries or support:

- **Email**: [zr7791474@gmail.com](mailto:zr7791474@gmail.com?subject=ZKR%20E-Commerce%20Inquiry&body=Hello%20Zakaria,%0A%0AI%20would%20like%20to%20contact%20you%20regarding%20the%20ZKR%20E-Commerce%20project...)
- **GitHub Issues**: [Create an issue](https://github.com/zr7791474-blip/ZKR-Ecommerce/issues)
- **WhatsApp**: [wa.me/212657516301](https://wa.me/212657516301)

---

<p align="center">Made with ❤️ by ZKR</p>