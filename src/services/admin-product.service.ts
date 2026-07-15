'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { ForbiddenError, UnauthorizedError, NotFoundError } from '@/lib/auth-errors';
import { productAdminSchema, type ProductAdminInput } from '@/lib/validations';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

/**
 * Every admin product mutation re-checks the session and role itself.
 * Middleware already blocks page navigation to /admin for non-admins, but
 * these are server actions that could in principle be invoked directly, so
 * they can't rely on the page-level guard alone.
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!ADMIN_ROLES.includes((session.user as any).role)) {
    throw new ForbiddenError('You do not have permission to manage products.');
  }
  return session.user;
}

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = slugify(base);
  let suffix = 1;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    suffix += 1;
    slug = `${slugify(base)}-${suffix}`;
  }
}

export async function adminListProducts(params: { search?: string; page?: number } = {}) {
  await requireAdmin();

  const { search, page = 1 } = params;
  const limit = 20;

  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { take: 1, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function adminGetProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) throw new NotFoundError('Product not found');
  return product;
}

export async function adminGetCategoriesAndBrands() {
  await requireAdmin();

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  return { categories, brands };
}

function normalizeInput(data: ProductAdminInput) {
  return {
    name: data.name,
    sku: data.sku,
    description: data.description || null,
    shortDescription: data.shortDescription || null,
    price: data.price,
    compareAtPrice: data.compareAtPrice === '' || data.compareAtPrice === undefined ? null : Number(data.compareAtPrice),
    stock: data.stock,
    categoryId: data.categoryId,
    brandId: data.brandId || null,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    isNew: data.isNew,
    isBestSeller: data.isBestSeller,
  };
}

export async function createProduct(rawData: ProductAdminInput) {
  await requireAdmin();

  const data = productAdminSchema.parse(rawData);
  const slug = await uniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      ...normalizeInput(data),
      slug,
      images: { create: [{ url: data.imageUrl, position: 0 }] },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return product;
}

export async function updateProduct(id: string, rawData: ProductAdminInput) {
  await requireAdmin();

  const data = productAdminSchema.parse(rawData);
  const slug = await uniqueSlug(data.name, id);

  const product = await prisma.product.update({
    where: { id },
    data: normalizeInput(data),
  });

  // Replace the primary image if a new URL was provided.
  const existingImage = await prisma.productImage.findFirst({
    where: { productId: id },
    orderBy: { position: 'asc' },
  });

  if (existingImage) {
    if (existingImage.url !== data.imageUrl) {
      await prisma.productImage.update({
        where: { id: existingImage.id },
        data: { url: data.imageUrl },
      });
    }
  } else {
    await prisma.productImage.create({
      data: { productId: id, url: data.imageUrl, position: 0 },
    });
  }

  await prisma.product.update({ where: { id }, data: { slug } });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  // Soft delete — keeps order history intact for any past orders that
  // reference this product.
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
