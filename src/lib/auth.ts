import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { loginSchema } from './validations';


// used by auth.service.ts
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}


// optional helper
export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}


export const authOptions: NextAuthOptions = {

  // NextAuth v4 auto-reads NEXTAUTH_SECRET by default, but this project's
  // .env uses AUTH_SECRET (the v5 convention) — without this explicit
  // wiring, NextAuth would silently fail to pick up the configured secret.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma) as any,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },


  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/verify-email',
  },


  providers: [

    Credentials({

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },


      async authorize(credentials) {

        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }


        const {
          email,
          password,
        } = parsed.data;



        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });



        if (!user || !user.password) {
          return null;
        }



        const valid = await bcrypt.compare(
          password,
          user.password
        );


        if (!valid) {
          return null;
        }



        return {
          id: user.id,
          email: user.email,
          name: user.name,

          role: (user as any).role ?? 'CUSTOMER',

          twoFactorEnabled:
            (user as any).twoFactorEnabled ?? false,
        };
      },
    }),



    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret:
              process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),



    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret:
              process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),

  ],



  callbacks: {


    async jwt({
      token,
      user,
    }) {

      if (user) {

        token.id = (user as any).id;

        token.role =
          (user as any).role ?? 'CUSTOMER';


        token.twoFactorEnabled =
          (user as any).twoFactorEnabled ?? false;
      }


      return token;
    },



    async session({
      session,
      token,
    }) {


      if (session.user) {

        (session.user as any).id =
          token.id;


        (session.user as any).role =
          token.role;


        (session.user as any).twoFactorEnabled =
          token.twoFactorEnabled;
      }


      return session;
    },


  },

};



// NextAuth handler
export const {
  handlers,
  signIn,
  signOut,
} = NextAuth(authOptions);


// compatible with your services using auth()
export async function auth() {

  const { getServerSession } = await import(
    'next-auth'
  );

  return getServerSession(authOptions);

}