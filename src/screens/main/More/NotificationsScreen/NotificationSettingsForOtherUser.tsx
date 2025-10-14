import * as React from 'react';
import {View} from 'react-native';
import {
  NotificationType,
  hasExplicitNotificationSet,
  NOTIFICATIONS,
} from './utils';
import {NotificationSettings} from '@app/services/api/notifications';
import {NotificationToggleRow} from './NotificationToggleRow';
import {MedsenseText} from '@app/components/Text';
import {margin} from '@app/appearance/layout';

const SELF_NOTIFICATION_METHOD_TYPES: NotificationType[] = [
  NOTIFICATIONS.push,
  NOTIFICATIONS.sms,
  NOTIFICATIONS.phoneSelf,
  // NOTIFICATIONS.alexa,
];

const SELF_NOTIFICATION_ACITIVTY_TYPES: NotificationType[] = [
  NOTIFICATIONS.confirmatory,
];

const SHARED_NOTIFICATION_ACITIVTY_TYPES: NotificationType[] = [
  NOTIFICATIONS.missedDose,
  NOTIFICATIONS.takenDose,
  NOTIFICATIONS.timeToDose,
];

const SHARED_NOTIFICATION_METHOD_TYPES: NotificationType[] = [
  NOTIFICATIONS.push,
  NOTIFICATIONS.sms,
  NOTIFICATIONS.phone,
  // NOTIFICATIONS.alexa,
];

// TODO: The naming here is horrible and from the old app - figure out something here
const copy = {
  userSelfNotificationMethods: (name: string) =>
    `How does ${name} want to receive notifications?`,
  userSelfHeader2: (name: string) =>
    `Does ${name} want to receive taken dose confirmation notifications?`,
  sharedNotificationHeader: (name: string) =>
    `What types of notifications do you want to receive about ${name}?`,
  sharedNotificationMethodHeader: (name: string) =>
    `How do you want to receive notifications about ${name}?`,
};

type NotificationSectionProps = {
  sectionTitle: string;
  fullTypeList: NotificationType[];
  settings: NotificationSettings;
  onChange(notificationType: NotificationType, newValue: boolean): void;
};

const NotificationSection: React.FC<NotificationSectionProps> = ({
  onChange,
  sectionTitle,
  settings,
  fullTypeList,
}) => {
  const availableList: NotificationType[] = React.useMemo(() => {
    return fullTypeList.filter(notificationType => {
      return hasExplicitNotificationSet(settings, notificationType.id);
    });
  }, [settings, fullTypeList]);

  return (
    <View style={margin('bottom', 'p3')}>
      <MedsenseText weight="bold" size="h3" style={margin('bottom', 'p2')}>
        {sectionTitle}
      </MedsenseText>
      {availableList.map(notificationType => (
        <NotificationToggleRow
          key={notificationType.id}
          label={notificationType.label}
          value={settings[notificationType.id]!}
          onToggle={newValue => onChange(notificationType, newValue)}
        />
      ))}
    </View>
  );
};

type NotificationSettingsForOtherUserProps = {
  otherUserName: string;
  settings: NotificationSettings;
  sharedSettings: NotificationSettings;
  onChangeSettingForUser(
    notificationType: NotificationType,
    newValue: boolean,
  ): void;
  onChangeSharedSetting(
    notificationType: NotificationType,
    newValue: boolean,
  ): void;
};

export const NotificationSettingsForOtherUser: React.FC<
  NotificationSettingsForOtherUserProps
> = ({
  otherUserName,
  settings,
  sharedSettings,
  onChangeSettingForUser,
  onChangeSharedSetting,
}) => {
  return (
    <View>
      <NotificationSection
        sectionTitle={copy.userSelfNotificationMethods(otherUserName)}
        fullTypeList={SELF_NOTIFICATION_METHOD_TYPES}
        settings={settings}
        onChange={onChangeSettingForUser}
      />

      <NotificationSection
        sectionTitle={copy.userSelfNotificationMethods(otherUserName)}
        fullTypeList={SELF_NOTIFICATION_ACITIVTY_TYPES}
        settings={settings}
        onChange={onChangeSettingForUser}
      />

      <NotificationSection
        sectionTitle={copy.sharedNotificationHeader(otherUserName)}
        fullTypeList={SHARED_NOTIFICATION_ACITIVTY_TYPES}
        settings={sharedSettings}
        onChange={onChangeSharedSetting}
      />

      <NotificationSection
        sectionTitle={copy.sharedNotificationMethodHeader(otherUserName)}
        fullTypeList={SHARED_NOTIFICATION_METHOD_TYPES}
        settings={sharedSettings}
        onChange={onChangeSharedSetting}
      />
    </View>
  );
};

// const styles = StyleSheet.create({});
