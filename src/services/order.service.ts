'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { createCheckoutSession } from '@/lib/stripe';
import { UnauthorizedError, AppError } from '@/lib/auth-errors';
import { addressSchema } from '@/lib/validations';

export async function createOrder(data: {
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
      coupon: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty');
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.product.name}`);
    }
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + Number(item.product.price) * item.quantity,
    0
  );

  let discount = 0;
  if (cart.coupon) {
    if (cart.coupon.type === 'percentage') {
      discount = (subtotal * Number(cart.coupon.value)) / 100;
      if (cart.coupon.maxDiscount) {
        discount = Math.min(discount, Number(cart.coupon.maxDiscount));
      }
    } else if (cart.coupon.type === 'fixed') {
      discount = Number(cart.coupon.value);
    }
  }

  const tax = (subtotal - discount) * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal - discount + tax + shipping;

  const order = await prisma.$transaction(async (tx: any) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user!.id,
        paymentMethod: data.paymentMethod,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
        notes: data.notes,
        couponId: cart.couponId,
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            price: item.product.price,
            total: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Update coupon usage
    if (cart.couponId) {
      await tx.coupon.update({
        where: { id: cart.couponId },
        data: { usedCount: { increment: 1 } },
      });

      await tx.userCoupon.upsert({
        where: {
          userId_couponId: {
            userId: session.user!.id,
            couponId: cart.couponId,
          },
        },
        update: { usedAt: new Date() },
        create: {
          userId: session.user!.id,
          couponId: cart.couponId,
          usedAt: new Date(),
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });

    return newOrder;
  });

  // Send confirmation email
  await sendOrderConfirmationEmail(session.user.email!, order.orderNumber, Number(order.total));

  revalidatePath('/account/orders');
  revalidatePath('/cart');

  return { success: true, order };
}

export async function getOrders(page = 1, limit = 10) {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: { take: 3 },
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Public order lookup for the /track-order page — no login required.
 * Authorization is done by matching the provided email against the order's
 * own account email instead of a session, so a guest can check status
 * without signing in, but can't look up someone else's order by guessing
 * an order number alone.
 */
export async function trackOrderPublic(orderNumber: string, email: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: { select: { email: true } },
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
    },
  });

  if (!order || order.user.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new AppError('No matching order found for that order number and email.', 404);
  }

  return order;
}

export async function getOrder(orderNumber: string) {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
      invoices: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    throw new AppError('Order not found', 404);
  }

  return order;
}

export async function cancelOrder(orderNumber: string) {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    throw new AppError('Order not found', 404);
  }

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled');
  }

  await prisma.$transaction(async (tx: any) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });

    // Restore stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  });

  revalidatePath('/account/orders');
  return { success: true };
}

export async function createPaymentIntent(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) throw new AppError('Order not found', 404);

  const checkoutSession = await createCheckoutSession({
    orderId: order.orderNumber,
    email: session.user.email!,
    amount: Number(order.total),
    currency: order.currency,
    customerName: session.user.name || undefined,
  });

  return { success: true, url: checkoutSession.url };
}