'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/auth-errors';

export async function getCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
        coupon: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: { create: [] },
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
          coupon: true,
        },
      });
    }

    return cart;
  } catch (error) {
    console.error('getCart error:', error);
    throw error;
  }
}

export async function addToCart(productId: string, quantity: number = 1, variantId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('addToCart error:', error);
    return { success: false, error: 'Failed to add to cart' };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('updateCartItem error:', error);
    return { success: false, error: 'Failed to update cart item' };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    await prisma.cartItem.delete({ where: { id: itemId } });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('removeCartItem error:', error);
    return { success: false, error: 'Failed to remove cart item' };
  }
}

export async function clearCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    await prisma.cartItem.deleteMany({
      where: { cart: { userId: session.user.id } },
    });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('clearCart error:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}

export async function applyCoupon(code: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { success: false, error: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { success: false, error: 'Coupon is no longer active' };
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return { success: false, error: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, error: 'Coupon usage limit reached' };
    }

    const userCoupon = await prisma.userCoupon.findUnique({
      where: {
        userId_couponId: {
          userId: session.user.id,
          couponId: coupon.id,
        },
      },
    });

    if (userCoupon && userCoupon.usedAt && coupon.perUserLimit <= 1) {
      return { success: false, error: 'You have already used this coupon' };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return { success: false, error: 'Cart not found' };
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: coupon.id },
    });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, coupon };
  } catch (error) {
    console.error('applyCoupon error:', error);
    return { success: false, error: 'Failed to apply coupon' };
  }
}

export async function removeCoupon() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError();

    await prisma.cart.update({
      where: { userId: session.user.id },
      data: { couponId: null },
    });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    console.error('removeCoupon error:', error);
    return { success: false, error: 'Failed to remove coupon' };
  }
}