import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // The /checkout page is already gated by middleware, but that only
    // protects page navigation. This endpoint can be hit directly, so it
    // needs its own server-side check — client-side gating alone isn't
    // trustworthy here.
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to check out.' },
        { status: 401 }
      );
    }

    const { items, email } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // 🧠 calculate total from cart
    const amount = items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    // 🆕 create fake order id (later will be Prisma)
    const orderId = `ORD-${Date.now()}`;

    const checkoutSession = await createCheckoutSession({
      orderId,
      email: email || session.user.email || 'guest@example.com',
      amount,
      currency: 'usd',
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}