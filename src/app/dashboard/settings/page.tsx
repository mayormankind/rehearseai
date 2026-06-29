'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { User, Settings, LogOut, Sun, Moon, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.name || '');
        setEmail(user.email || '');
      }
    };
    loadUserData();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="p-4 md:p-8 pt-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Appearance
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'system'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-4">
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Danger Zone
          </h3>
          <button
            onClick={handleSignOut}
            className="w-full py-3 bg-destructive text-destructive-foreground font-semibold rounded-xl hover:brightness-110 transition-all active:scale-[0.97]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
