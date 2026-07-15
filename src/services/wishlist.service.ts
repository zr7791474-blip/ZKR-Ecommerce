'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/auth-errors';

/**
 * Server-authoritative wishlist. Every function here re-checks the session
 * itself rather than trusting a userId passed in from the client — the
 * wishlist is looked up strictly by the current session's user, so there is
 * no way for one user's request to read or modify another user's wishlist.
 */

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError('You must be signed in to use the wishlist.');
  }
  return session.user.id;
}

async function getOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getWishlistItems() {
  const session = await auth();
  if (!session?.user?.id) {
    // Guests simply have an empty wishlist — never a locally-faked one.
    return [];
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { position: 'asc' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!wishlist) return [];

  return wishlist.items.map((item: any) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.images[0]?.url || '/placeholder.png',
    price: Number(item.product.price),
  }));
}

export async function addToWishlist(productId: string) {
  const userId = await requireUserId();
  const wishlist = await getOrCreateWishlist(userId);

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
    update: {},
    create: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  revalidatePath('/account/wishlist');
  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  const userId = await requireUserId();
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  if (!wishlist) return { success: true };

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId },
  });

  revalidatePath('/account/wishlist');
  return { success: true };
}
