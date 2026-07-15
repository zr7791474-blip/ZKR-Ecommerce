import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, ...rest } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Reset link is invalid or missing.' },
        { status: 400 }
      );
    }

    const parsed = resetPasswordSchema.safeParse(rest);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid password' },
        { status: 400 }
      );
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      if (record) {
        await prisma.verificationToken.delete({ where: { token } }).catch(() => {});
      }
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: record.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'We could not find an account for this link.' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(parsed.data.password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
