import * as React from 'react';
import {View} from 'react-native';
import {
  NotificationType,
  hasExplicitNotificationSet,
  NOTIFICATIONS,
} from './utils';
import {NotificationToggleRow} from './NotificationToggleRow';
import {NotificationSettings} from '@app/services/api/notifications';

type MyNotificationSettingsProps = {
  settings: NotificationSettings;
  onChangeSetting(notificationType: NotificationType, value: boolean): void;
};

export const NOTIFICATION_TYPES: NotificationType[] = [
  NOTIFICATIONS.takenDose,
  NOTIFICATIONS.timeToDose,
  NOTIFICATIONS.missedDose,
  NOTIFICATIONS.confirmatory,
  NOTIFICATIONS.push,
  NOTIFICATIONS.alexa,
  NOTIFICATIONS.sms,
  NOTIFICATIONS.phone,
  NOTIFICATIONS.phoneSelf,
];

export const MyNotificationSettings: React.FC<MyNotificationSettingsProps> = ({
  settings,
  onChangeSetting,
}) => {
  const availableNotificationTypes = React.useMemo(() => {
    return NOTIFICATION_TYPES.filter(notificationType => {
      return hasExplicitNotificationSet(settings, notificationType.id);
    });
  }, [settings]);

  return (
    <View>
      {availableNotificationTypes.map(notificationType => (
        <NotificationToggleRow
          key={notificationType.id}
          label={notificationType.label}
          value={settings[notificationType.id]!}
          onToggle={newValue => onChangeSetting(notificationType, newValue)}
        />
      ))}
    </View>
  );
};

// const styles = StyleSheet.create({});
