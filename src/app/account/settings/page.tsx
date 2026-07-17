import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/services/user.service';
import { getInitials } from '@/lib/utils';
import { ProfileForm } from '@/components/account/profile-form';
import { PasswordForm } from '@/components/account/password-form';
import { PreferencesForm } from '@/components/account/preferences-form';

export const metadata = {
  title: 'Account Settings | ZKR E-Commerce',
};

export default async function AccountSettingsPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) redirect('/login?redirect=/account/settings');

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="relative max-w-2xl mx-auto py-10 md:py-14 px-4">
      <div className="absolute -top-20 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.06] blur-[110px] pointer-events-none" />

      <div className="relative mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 shadow-premium">
          {getInitials(profile.name)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Member since {memberSince}
          </p>
        </div>
      </div>

      <div className="relative space-y-6">
        <ProfileForm
          email={profile.email}
          defaultValues={{
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
          }}
        />

        {profile.password ? (
          <PasswordForm />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card p-5 text-sm text-muted-foreground">
            You signed in with a social account, so there&apos;s no password to change here.
          </div>
        )}

        <PreferencesForm />
      </div>
    </div>
  );
}
