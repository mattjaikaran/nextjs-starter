'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
}

interface NotificationsTabProps {
  notifications: NotificationSettings;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>;
}

const notificationItems = [
  {
    id: 'emailNotifications' as keyof NotificationSettings,
    label: 'Email Notifications',
    description: 'Receive notifications via email',
  },
  {
    id: 'pushNotifications' as keyof NotificationSettings,
    label: 'Push Notifications',
    description: 'Receive push notifications in your browser',
  },
  {
    id: 'weeklyDigest' as keyof NotificationSettings,
    label: 'Weekly Digest',
    description: 'Receive a weekly summary of your activity',
  },
  {
    id: 'taskReminders' as keyof NotificationSettings,
    label: 'Task Reminders',
    description: 'Get reminded about upcoming due dates',
  },
];

export function NotificationsTab({ notifications, setNotifications }: NotificationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationItems.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={item.label}
              aria-checked={notifications[item.id]}
              onClick={() =>
                setNotifications(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id],
                }))
              }
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                notifications[item.id] ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block size-5 transform rounded-full bg-background shadow-lg ring-0 transition',
                  notifications[item.id] ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        ))}
        <Button className="gap-2">
          <Save className="size-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
