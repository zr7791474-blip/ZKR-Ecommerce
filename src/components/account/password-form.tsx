'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { changePasswordFormSchema, type ChangePasswordFormInput } from '@/lib/validations';
import { changeUserPassword } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onSubmit = async (data: ChangePasswordFormInput) => {
    setLoading(true);
    try {
      await changeUserPassword(data);
      toast.success('Password updated');
      reset();
    } catch (err: any) {
      toast.error(err?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  const type = showPasswords ? 'text' : 'password';

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Password</CardTitle>
        <CardDescription>Update the password used to sign in</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" type={type} {...register('currentPassword')} />
            </div>
            {errors.currentPassword && <p className="text-xs text-accent">{errors.currentPassword.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" type={type} {...register('newPassword')} />
              </div>
              {errors.newPassword && <p className="text-xs text-accent">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" type={type} {...register('confirmNewPassword')} />
              </div>
              {errors.confirmNewPassword && <p className="text-xs text-accent">{errors.confirmNewPassword.message}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
