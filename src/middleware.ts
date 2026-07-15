import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/products',
  '/categories',
  '/about',
  '/contact',
  '/blog',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
  '/shipping',
  '/returns',
  '/track-order',
  '/help',
  '/careers',
];

const adminPaths = ['/admin'];
const customerPaths = ['/account', '/checkout', '/orders'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = await getToken({
   req: request,
   secret: process.env.AUTH_SECRET!,
   });

  // Admin protection
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login?redirect=/admin', request.url)
      );
    }

    if (
      token.role !== 'ADMIN' &&
      token.role !== 'SUPER_ADMIN' &&
      token.role !== 'MANAGER'
    ) {
      return NextResponse.redirect(
        new URL('/account', request.url)
      );
    }
  }

  // Customer protection
  if (customerPaths.some((path) =>
    pathname.startsWith(path)
  )) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  // Logged user redirect
  if (
    ['/login', '/register'].includes(pathname) &&
    token
  ) {
    const redirectPath =
      token.role === 'ADMIN' ||
      token.role === 'SUPER_ADMIN' ||
      token.role === 'MANAGER'
        ? '/admin'
        : '/account';

    return NextResponse.redirect(
      new URL(redirectPath, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|manifest.json|sw.js).*)',
  ],
};