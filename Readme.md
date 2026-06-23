
<p align="center">
  <img src="https://img.shields.io/badge/ZKR-Ecommerce-black?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-success" />
</p>

<p align="center">
A modern, scalable and production-ready full-stack eCommerce platform built with Next.js 14, TypeScript, Prisma, PostgreSQL (Neon), and NextAuth.
</p>

---

# 🚀 Overview

ZKR Ecommerce is a modern full-stack online shopping platform built for performance, scalability, and production deployment.

It provides a fast, responsive, and clean shopping experience with modern architecture using the latest React ecosystem tools.

---

# 🌍 Live Demo

🔗 Coming soon after Vercel deployment

---

# 🛠 Tech Stack

| Category        | Technology |
|----------------|------------|
| Framework      | Next.js 14 (App Router) |
| Language       | TypeScript |
| UI             | React 18 |
| Styling        | Tailwind CSS |
| Components     | shadcn/ui |
| Animations     | Framer Motion |
| Database       | PostgreSQL (Neon) |
| ORM            | Prisma |
| Auth           | NextAuth |
| Forms          | React Hook Form |
| Validation     | Zod |
| State Mgmt     | Zustand |
| Icons          | Lucide React |

---

# ✨ Features

## 🛍 Product System
- Product listing
- Categories
- Product details page
- Multiple images
- Variants support
- Stock management
- Related products

---

## 🛒 Cart System
- Add to cart
- Remove items
- Update quantity
- Persistent cart (Zustand)
- Coupon system ready
- Checkout-ready structure

---

## 👤 Authentication
- NextAuth integration
- Secure sessions
- Protected routes
- Scalable auth structure

---

## 💳 Checkout (Ready)
- Order flow structure
- Stripe-ready architecture
- Shipping support ready

---

## 🎨 UI/UX
- Fully responsive
- Mobile-first design
- Dark mode ready
- Smooth animations
- Loading states
- Clean modern UI

---

# 📸 UI Overview

## 🏠 Home Page
![Home](./screenshots/home.png)

## 🛍 Product Page
![Product](./screenshots/product.png)

## 🛒 Cart Page
![Cart](./screenshots/cart.png)

---

# 🧱 Project Structure

```

src/
├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── ecommerce/
│   ├── layout/
│   └── shared/
│
├── services/
├── stores/
├── lib/
├── hooks/
├── types/
└── styles/

````

---

# ⚙️ Installation

```bash
git clone https://github.com/your-username/zkr-ecommerce.git
cd zkr-ecommerce
npm install
````

---

# 🔑 Environment Variables

Create `.env` file:

```env
DATABASE_URL="your-neon-db-url"

NEXTAUTH_SECRET="your-secret-key"

NEXTAUTH_URL="http://localhost:3000"

NODE_ENV=development
```

---

# 🗄 Database Setup

```bash
npx prisma generate
npx prisma db push
```

(Optional)

```bash
npx prisma studio
```

---

# ▶ Run Project

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

# 🚀 Deployment (Vercel)

## Steps:

1. Push project to GitHub
2. Import repository in Vercel
3. Add environment variables:

```env
DATABASE_URL=neon-production-url
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

4. Click Deploy 🚀

---

# 📦 Production Ready

✔ Next.js 14 App Router
✔ TypeScript Strict Mode
✔ Prisma ORM
✔ PostgreSQL (Neon)
✔ Authentication system
✔ Responsive UI
✔ Clean architecture
✔ SEO ready
✔ Scalable structure

---

# 📈 Roadmap

* [ ] Stripe Payments
* [ ] Admin Dashboard
* [ ] Order Tracking
* [ ] Wishlist System
* [ ] Product Reviews
* [ ] Email notifications
* [ ] Analytics dashboard
* [ ] Multi-vendor support
* [ ] Image upload (Cloud storage)

---

# 🤝 Contributing

Pull requests are welcome.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**ZKR (Zakaria Adli)**

* GitHub: [https://github.com/zr7791474-blip](https://github.com/zr7791474-blip)
* Email: [zr7791474@gmail.com](mailto:zr7791474@gmail.com)
* X: [https://x.com/zkr_ad](https://x.com/zkr_ad)
* WhatsApp: [https://wa.me/212657516301](https://wa.me/212657516301)

---

<p align="center">
Made with ❤️ using Next.js, TypeScript & Prisma
</p>
