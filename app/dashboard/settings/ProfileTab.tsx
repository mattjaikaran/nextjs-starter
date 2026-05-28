'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

interface ProfileTabProps {
  profileForm: { firstName: string; lastName: string; email: string };
  setProfileForm: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function ProfileTab({ profileForm, setProfileForm, onSubmit, isPending }: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={e =>
                  setProfileForm(prev => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={e =>
                  setProfileForm(prev => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={e =>
                setProfileForm(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="john@example.com"
            />
          </div>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
