'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UnauthorizedError, ValidationError } from '@/lib/auth-errors';
import {
  updateProfileSchema,
  changePasswordFormSchema,
  type UpdateProfileInput,
  type ChangePasswordFormInput,
} from '@/lib/validations';

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user.id as string;
}

export async function getCurrentUserProfile() {
  const userId = await requireUserId();

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      password: true, // only to know if a password exists — never sent to the client form
      createdAt: true,
    },
  });
}

export async function updateProfile(rawData: UpdateProfileInput) {
  const userId = await requireUserId();
  const data = updateProfileSchema.parse(rawData);

  const name = `${data.firstName} ${data.lastName}`.trim();

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      name,
      phone: data.phone || null,
    },
  });

  revalidatePath('/account/settings');
  revalidatePath('/account');
  return { success: true };
}

export async function changeUserPassword(rawData: ChangePasswordFormInput) {
  const userId = await requireUserId();
  const data = changePasswordFormSchema.parse(rawData);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.password) {
    throw new ValidationError('This account signs in through a social provider and has no password to change.');
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) {
    throw new ValidationError('Current password is incorrect.');
  }

  const hashed = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { success: true };
}
