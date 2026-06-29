'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Mic, Clock, Settings, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Record',    href: '/dashboard/record',   icon: Mic },
  { label: 'History',   href: '/dashboard/history',  icon: Clock },
  { label: 'Settings',  href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const displayName = user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'Account';

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-56 min-h-screen flex-col bg-card border-r border-border flex-shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
              <Mic className="w-3.5 h-3.5 text-primary-foreground" />
            </span>
            <span className="font-bold text-foreground">
              Rehearse<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-border space-y-0.5">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          const isRecord = href === '/dashboard/record';
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isRecord ? (
                <span
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-colors mb-0.5',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </span>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
