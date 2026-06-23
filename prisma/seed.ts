import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Optional: CLEAN OLD DATA (IMPORTANT)
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.page.deleteMany();

  // Admin
  const adminPassword = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zkrstore.com' },
    update: {},
    create: {
      email: 'admin@zkrstore.com',
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and devices',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and gear',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Bestselling books',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } }),
    prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } }),
    prisma.brand.create({ data: { name: 'Nike', slug: 'nike' } }),
    prisma.brand.create({ data: { name: 'Adidas', slug: 'adidas' } }),
    prisma.brand.create({ data: { name: 'Sony', slug: 'sony' } }),
  ]);

  console.log('✅ Brands created:', brands.length);

  // FIXED IMAGES (ONE PER PRODUCT - CLEAN)
  const productImages: Record<string, string[]> = {
    'iphone-15-pro-max': ['/products/iphone15.jpg'],
    'macbook-pro-16': ['/products/macbook.jpg'],
    'airpods-pro-2': ['/products/airpods.jpg'],
    'nike-air-max-270': ['/products/nike-airmax.jpg'],
    'sony-wh-1000xm5': ['/products/sony-wh1000xm5.jpg'],
  };

  const products = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      sku: 'IPHONE-15-PM-256',
      description:
        'The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system.',
      shortDescription: 'Latest iPhone with A17 Pro chip',
      price: 1199,
      compareAtPrice: 1299,
      stock: 50,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      sku: 'MBP-16-M3-512',
      description: 'Supercharged by M3 Pro or M3 Max chip.',
      shortDescription: 'Powerful laptop with M3 chip',
      price: 2499,
      stock: 25,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      sku: 'APP-2-USB-C',
      description: 'Adaptive Audio and USB-C charging.',
      shortDescription: 'Premium wireless earbuds',
      price: 249,
      compareAtPrice: 279,
      stock: 100,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      isNew: true,
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      sku: 'NIKE-AM270-BLK',
      description: 'Nike lifestyle Air Max sneaker.',
      shortDescription: 'Iconic lifestyle sneaker',
      price: 150,
      stock: 75,
      categoryId: categories[3].id,
      brandId: brands[2].id,
      isFeatured: true,
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      sku: 'SONY-WH1000XM5',
      description: 'Industry-leading noise cancellation.',
      shortDescription: 'Premium noise-cancelling headphones',
      price: 399,
      compareAtPrice: 449,
      stock: 40,
      categoryId: categories[0].id,
      brandId: brands[4].id,
      isBestSeller: true,
    },
  ];

  // CREATE PRODUCTS WITH IMAGES (FIXED RELATION)
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        images: {
          create: (productImages[product.slug] || []).map(
            (url, i) => ({
              url,
              position: i,
            })
          ),
        },
      },
    });

    console.log('🟢 Created product:', created.name);
  }

  // Coupon
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'percentage',
      value: 10,
      startDate: new Date(),
      endDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ),
      usageLimit: 1000,
      perUserLimit: 1,
    },
  });

  console.log('✅ Coupon created: WELCOME10');

  // Pages
  await prisma.page.createMany({
    data: [
      {
        title: 'About Us',
        slug: 'about',
        content: 'Welcome to ZKR Store.',
        isPublished: true,
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy',
        content: 'Your privacy is important.',
        isPublished: true,
      },
      {
        title: 'Terms & Conditions',
        slug: 'terms',
        content: 'By using this site you agree...',
        isPublished: true,
      },
    ],
  });

  console.log('✅ Pages created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });