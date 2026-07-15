'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PreferencesForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Preferences</CardTitle>
        <CardDescription>Choose how ZKR E-Commerce looks on your device</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div>
            <p className="font-medium text-foreground">Theme</p>
            <p className="text-sm text-muted-foreground">
              {mounted ? (theme === 'dark' ? 'Dark mode' : 'Light mode') : 'Loading...'}
            </p>
          </div>

          {mounted && (
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-secondary/40 p-1">
              <Button
                size="sm"
                variant={theme === 'light' ? 'secondary' : 'ghost'}
                className="rounded-full"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button
                size="sm"
                variant={theme === 'dark' ? 'secondary' : 'ghost'}
                className="rounded-full"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" /> Dark
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
