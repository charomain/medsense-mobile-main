import {NotificationSettings} from '@app/services/api/notifications';

export type NotificationTypeIdentifier = keyof NotificationSettings;

export type NotificationType = {
  id: NotificationTypeIdentifier;
  label: string;
  requiresPhoneNumber?: boolean;
};

export const NOTIFICATIONS: Record<
  NotificationTypeIdentifier,
  NotificationType
> = {
  takenDose: {
    id: 'takenDose',
    label: 'For Taken Doses',
  },
  timeToDose: {
    id: 'timeToDose',
    label: 'When it is time for them to take their medications',
  },
  missedDose: {
    id: 'missedDose',
    label: 'Missed Dose Notification',
  },
  confirmatory: {
    id: 'confirmatory',
    label: 'Taken Dose Notifications',
  },
  push: {
    id: 'push',
    label: 'Mobile App Notifications',
  },
  alexa: {
    id: 'alexa',
    label: 'Alexa Reminders',
  },
  sms: {
    id: 'sms',
    label: 'Text Messages',
    requiresPhoneNumber: true,
  },
  phone: {
    id: 'phone',
    label: 'Telephone Calls',
    requiresPhoneNumber: true,
  },
  phoneSelf: {
    id: 'phoneSelf',
    label: 'Telephone Calls',
    requiresPhoneNumber: true,
  },
};

export const hasExplicitNotificationSet = (
  settings: NotificationSettings,
  id: NotificationTypeIdentifier,
) => {
  const value = settings[id];
  // value can be null / undefined
  return value === true || value === false;
};
