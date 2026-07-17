'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations';
import { resetPassword } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setErrorMsg('This reset link is invalid or missing a token.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await resetPassword(token, data.password);

      if (!result.success) {
        setErrorMsg(result.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2200);
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

            <p className="text-[11px] font-semibold tracking-widest uppercase text-warm">Premium Shopping Experience</p>

            <CardTitle className="text-2xl font-bold">
              Set a new password
            </CardTitle>

            <CardDescription>
              Choose a strong password you haven&apos;t used before.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!token && !success && (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground">
                  This link is missing a reset token. Please request a new password reset link.
                </p>
                <Button asChild className="w-full">
                  <Link href="/forgot-password">Request new link</Link>
                </Button>
              </div>
            )}

            {token && (
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4 space-y-4"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-success" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold">Password updated</p>
                      <p className="text-sm text-muted-foreground">
                        Redirecting you to sign in...
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>New password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10 pr-10"
                          type={showPassword ? 'text' : 'password'}
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type={showPassword ? 'text' : 'password'}
                          {...register('confirmPassword')}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {errorMsg && (
                      <p className="text-sm text-destructive text-center">{errorMsg}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Reset password'
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
