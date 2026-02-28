'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MagicLinkForm } from '@/forms/auth/MagicLinkForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MagicLinkPage() {
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Magic Link Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <MagicLinkForm
              onSuccess={() => router.push('/dashboard')}
              onSwitchToLogin={() => router.push('/login')}
            />
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in with password
          </Link>
        </p>
      </div>
    </div>
  );
}
