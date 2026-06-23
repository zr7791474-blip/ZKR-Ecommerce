import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { constructWebhookEvent } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  try {
    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const orderNumber = session.metadata?.orderId;

        if (orderNumber) {
          await prisma.order.update({
            where: { orderNumber },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
              paymentId: session.payment_intent as string,
            },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed':
        break;

      case 'charge.refunded':
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}