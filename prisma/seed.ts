import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { demoProducts } from '../src/lib/demo-products';
import { slugify } from '../src/lib/utils';

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

  // Demo Customer account
  const customerPassword = await bcrypt.hash('Customer123!', 12);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@zkrstore.com' },
    update: {},
    create: {
      email: 'customer@zkrstore.com',
      name: 'Demo Customer',
      firstName: 'Demo',
      lastName: 'Customer',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Customer demo user created:', customer.email);

  // Demo Viewer account — NOTE: the schema's UserRole enum has no VIEWER
  // value (CUSTOMER, EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN only). Adding a
  // real VIEWER role requires a schema migration. As a stand-in, this
  // account uses EMPLOYEE and the app layer should treat EMPLOYEE as
  // read-only until a proper migration adds a dedicated role.
  const viewerPassword = await bcrypt.hash('Viewer123!', 12);

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@zkrstore.com' },
    update: {},
    create: {
      email: 'viewer@zkrstore.com',
      name: 'Demo Viewer',
      firstName: 'Demo',
      lastName: 'Viewer',
      password: viewerPassword,
      role: 'EMPLOYEE',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Viewer demo user created (role: EMPLOYEE, read-only enforced in UI):', viewer.email);

  // Categories — the original 5 plus every category used by the shared
  // demo product catalog (src/lib/demo-products.ts), so seeded real
  // products and the catalog use exactly the same category taxonomy.
  const baseCategoryDefs = [
    { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and devices' },
    { name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear' },
    { name: 'Books', slug: 'books', description: 'Bestselling books' },
  ];

  const demoCategoryDefs = Array.from(
    new Map(
      demoProducts.map((p) => [
        p.category.slug,
        { name: p.category.name, slug: p.category.slug, description: `${p.category.name} products` },
      ])
    ).values()
  ).filter((c) => !baseCategoryDefs.some((b) => b.slug === c.slug));

  const categoryDefs = [...baseCategoryDefs, ...demoCategoryDefs];

  const categories: any[] = [];
  for (const def of categoryDefs) {
    const category = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {},
      create: def,
    });
    categories.push(category);
  }

  const categoryBySlug = new Map(categories.map((c: any) => [c.slug, c]));

  console.log('✅ Categories created:', categories.length);

  // Brands — the original 5 plus one brand per unique brand name in the
  // demo catalog.
  const baseBrandDefs = [
    { name: 'Apple', slug: 'apple' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Nike', slug: 'nike' },
    { name: 'Adidas', slug: 'adidas' },
    { name: 'Sony', slug: 'sony' },
  ];

  const demoBrandDefs = Array.from(new Set(demoProducts.map((p) => p.brand)))
    .map((name) => ({ name, slug: slugify(name) }))
    .filter((b) => !baseBrandDefs.some((base) => base.slug === b.slug));

  const brandDefs = [...baseBrandDefs, ...demoBrandDefs];

  const brands: any[] = [];
  for (const def of brandDefs) {
    const brand = await prisma.brand.upsert({
      where: { slug: def.slug },
      update: {},
      create: def,
    });
    brands.push(brand);
  }

  const brandBySlug = new Map(brands.map((b: any) => [b.slug, b]));

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

  // Images already covered by the 5 hand-authored products above — skip
  // these when generating the rest from the shared demo catalog so we
  // never create a duplicate-looking product for the same image.
  const alreadySeededImages = new Set(
    Object.values(productImages).flat()
  );

  const generatedProducts = demoProducts
    .filter((p) => !alreadySeededImages.has(p.images[0].url))
    .map((p) => {
      const slug = p.slug.replace(/^demo-/, '');
      const category = categoryBySlug.get(p.category.slug) as any;
      const brand = brandBySlug.get(slugify(p.brand)) as any;

      return {
        name: p.name,
        slug,
        sku: p.sku,
        description: p.description,
        shortDescription: p.description.slice(0, 80),
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? undefined,
        stock: p.stock,
        categoryId: category.id,
        brandId: brand.id,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isBestSeller: (p.averageRating ?? 0) >= 4.7 && (p._count.ratings ?? 0) >= 150,
        imageUrl: p.images[0].url,
      };
    });

  console.log(
    `ℹ️  Generating ${generatedProducts.length} additional products from the shared demo catalog (public/products/), skipping ${alreadySeededImages.size} images already covered above.`
  );

  // CREATE PRODUCTS WITH IMAGES (FIXED RELATION) — idempotent via upsert
  // so re-running the seed doesn't fail or duplicate products.
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: {
          create: (productImages[product.slug] || []).map((url, i) => ({
            url,
            position: i,
          })),
        },
      },
    });

    console.log('🟢 Created product:', created.name);
  }

  for (const { imageUrl, ...product } of generatedProducts) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: {
          create: [{ url: imageUrl, position: 0 }],
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