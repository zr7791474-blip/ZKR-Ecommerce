'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations';
import { updateProfile } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ProfileForm({
  email,
  defaultValues,
}: {
  email: string;
  defaultValues: UpdateProfileInput;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err?.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} disabled />
            <p className="text-xs text-muted-foreground">Your email is used to sign in and can't be changed here.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-accent">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-accent">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input {...register('phone')} placeholder="+1 (555) 000-0000" />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
