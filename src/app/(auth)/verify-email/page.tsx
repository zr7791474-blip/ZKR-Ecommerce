'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

import { verifyEmail } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Status = 'verifying' | 'success' | 'error' | 'missing';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'missing');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('missing');
      return;
    }

    let cancelled = false;

    verifyEmail(token).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setStatus('success');
      } else {
        setErrorMsg(result.error || 'Verification failed');
        setStatus('error');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-secondary/40 p-4 overflow-hidden">
      <div className="absolute -top-40 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/[0.06] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="border-border/60 shadow-premium">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 relative rounded-2xl bg-foreground/[0.03] border border-border p-2">
              <Image
                src="/logo.png"
                alt="ZKR E-Commerce"
                fill
                priority
                className="object-contain p-1"
              />
            </div>

            <p className="text-[11px] font-semibold tracking-widest uppercase text-warm">
              Premium Shopping Experience
            </p>

            {status === 'verifying' && (
              <>
                <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
                <CardDescription>Hang tight, this only takes a second.</CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <CardTitle className="text-2xl font-bold">Email verified</CardTitle>
                <CardDescription>Your account is confirmed and ready to go.</CardDescription>
              </>
            )}

            {status === 'error' && (
              <>
                <CardTitle className="text-2xl font-bold">Verification failed</CardTitle>
                <CardDescription>This link may have expired or already been used.</CardDescription>
              </>
            )}

            {status === 'missing' && (
              <>
                <CardTitle className="text-2xl font-bold">Missing verification link</CardTitle>
                <CardDescription>This page needs a verification token to continue.</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center gap-4 py-2">
              {status === 'verifying' && (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-7 h-7 text-success" />
                </motion.div>
              )}

              {(status === 'error' || status === 'missing') && (
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  {status === 'missing' ? (
                    <Mail className="w-7 h-7 text-accent" />
                  ) : (
                    <XCircle className="w-7 h-7 text-accent" />
                  )}
                </div>
              )}

              {status === 'error' && errorMsg && (
                <p className="text-sm text-muted-foreground text-center">{errorMsg}</p>
              )}

              {(status === 'success' || status === 'error' || status === 'missing') && (
                <Button asChild className="w-full mt-2">
                  <Link href={status === 'success' ? '/login' : '/register'}>
                    {status === 'success' ? 'Continue to Sign In' : 'Back to Sign Up'}
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}
