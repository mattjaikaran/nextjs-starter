'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/lib/store';
import { redirect } from 'next/navigation';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
