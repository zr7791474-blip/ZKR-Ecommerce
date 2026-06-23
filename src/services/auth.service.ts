'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { registerSchema, RegisterInput } from '@/lib/validations';
import { sendVerificationEmail } from '@/lib/email';
import { AppError } from '@/lib/auth-errors';
import { nanoid } from 'nanoid';

export async function registerUser(data: RegisterInput) {
  try {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid data' };
    }

    const { firstName, lastName, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return { success: false, error: 'Email already registered' };
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = nanoid(32);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: null,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, verificationToken);

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

export async function verifyEmail(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired token' };
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('verifyEmail error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: true };
    }

    const token = nanoid(32);

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await import('@/lib/email').then(({ sendPasswordResetEmail }) =>
      sendPasswordResetEmail(email, token)
    );

    return { success: true };
  } catch (error) {
    console.error('forgotPassword error:', error);
    return { success: false, error: 'Failed to send reset email' };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired token' };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error('resetPassword error:', error);
    return { success: false, error: 'Password reset failed' };
  }
}