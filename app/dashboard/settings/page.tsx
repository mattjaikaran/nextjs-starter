'use client';

import { useChangePassword, useUpdateProfile } from '@/hooks';
import { useAuth } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Bell, Palette, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { AppearanceTab } from './AppearanceTab';
import { NotificationsTab } from './NotificationsTab';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [profileForm, setProfileForm] = useState({
    firstName: (user as { firstName?: string })?.firstName || '',
    lastName: (user as { lastName?: string })?.lastName || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    taskReminders: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      ...profileForm,
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
    } as Parameters<typeof updateProfile.mutate>[0]);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
    changePassword.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="shrink-0 lg:w-64">
          <div className="space-y-1 lg:sticky lg:top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="max-w-2xl flex-1">
          {activeTab === 'profile' && (
            <ProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSubmit={handleProfileSubmit}
              isPending={updateProfile.isPending}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
          {activeTab === 'security' && (
            <SecurityTab
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              onSubmit={handlePasswordSubmit}
              isPending={changePassword.isPending}
            />
          )}
          {activeTab === 'appearance' && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}
