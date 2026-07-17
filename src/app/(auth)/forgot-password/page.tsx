'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations';
import { forgotPassword } from '@/services/auth.service';
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

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await forgotPassword(data.email);

      if (!result.success) {
        setErrorMsg(result.error || 'Something went wrong. Please try again.');
        return;
      }

      setSent(true);
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
              Forgot your password?
            </CardTitle>

            <CardDescription>
              No worries — enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {sent ? (
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
                    <p className="font-semibold">Check your inbox</p>
                    <p className="text-sm text-muted-foreground">
                      If an account exists for <span className="font-medium text-foreground">{getValues('email')}</span>, a reset link is on its way. The link expires in 1 hour.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                    Use a different email
                  </Button>
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
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {errorMsg && (
                    <p className="text-sm text-destructive text-center">{errorMsg}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
