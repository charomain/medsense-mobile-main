import {margin, padding} from '@app/appearance/layout';
import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {ListToggle} from '@app/components/ListToggle';
import {MedsenseScreen} from '@app/components/Screen';
import {useManagedAccounts, useProfile} from '@app/stores/auth';
import {AccessibleUserProfile} from '@app/models/profile';
import * as React from 'react';
import {Alert, ScrollView} from 'react-native';
import {useNotificationsAPI} from './hooks';
import {MyNotificationSettings} from './MyNotificationSettings';
import {NotificationSettingsForOtherUser} from './NotificationSettingsForOtherUser';
import {NotificationType} from './utils';
import {
  SaveNotificationSettingsRequest,
  SaveSharedNotificationSettingsRequest,
} from '@app/services/api/notifications';
import {MoreStackScreenProps} from '../../types';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';

type NotificationsScreenProps = MoreStackScreenProps<'Notifications'>;

const copy = {
  title: 'Notifications',
  selectorLabel: 'Managing notifications for',
};

type NotificationUser = AccessibleUserProfile | 'me';
const getLabelForOption = (u: NotificationUser) =>
  u === 'me' ? 'Me' : u.email;
const getKeyForOption = (u: NotificationUser) =>
  u === 'me' ? 'me' : u.id.toString();

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const profile = useProfile();
  const managedAccounts = useManagedAccounts();
  const notificationUserOptions = React.useMemo((): NotificationUser[] => {
    return (['me'] as NotificationUser[]).concat(managedAccounts);
  }, [managedAccounts]);

  const [notificationUser, setNotificationUser] =
    React.useState<NotificationUser>('me');

  const {
    loading,
    notificationSettings,
    sharedNotificationSettings,
    fetchNotificationSettings,
    saveNotificationSettings,
    fetchSharedNotificationSettings,
    saveSharedNotificationSettings,
  } = useNotificationsAPI();

  React.useEffect(() => {
    if (notificationUser === 'me') {
      fetchNotificationSettings({
        userId: profile!.id,
      });
    } else {
      fetchNotificationSettings({
        userId: notificationUser.id,
      });

      fetchSharedNotificationSettings({
        userId: notificationUser.id,
      });
    }
  }, [
    profile,
    notificationUser,
    fetchNotificationSettings,
    fetchSharedNotificationSettings,
  ]);

  const hasPhone = React.useMemo(() => {
    if (notificationUser === 'me') {
      return !!profile.phoneNumber;
    } else {
      return true;
    }
  }, [notificationUser, profile]);

  const onChangeSettingForUser = React.useCallback(
    (notificationType: NotificationType, value: boolean) => {
      const notificationId = notificationType.id;
      const valueForReqForKey = (
        key: keyof Omit<SaveNotificationSettingsRequest, 'userId'>,
      ) => {
        if (key === notificationId) {
          return value;
        } else {
          return notificationSettings![key]!;
        }
      };

      if (notificationType.requiresPhoneNumber && !hasPhone) {
        Alert.alert(
          'Setup phone number?',
          'Your account does not have a phone number setup. Would you like to add one?',
          [
            {
              text: 'Yes',
              onPress: () =>
                navigation.navigate('Account', {screen: 'EditProfile'}),
            },
            {
              text: 'Not right now',
              onPress: () => console.log('Ask me later pressed'),
            },
          ],
        );

        return;
      }

      saveNotificationSettings({
        userId: notificationUser === 'me' ? profile.id : notificationUser.id,
        confirmatory: valueForReqForKey('confirmatory'),
        phone: valueForReqForKey('phone'),
        alexa: valueForReqForKey('alexa'),
        sms: valueForReqForKey('sms'),
        push: valueForReqForKey('push'),
      });
    },
    [
      notificationUser,
      hasPhone,
      profile,
      notificationSettings,
      saveNotificationSettings,
      navigation,
    ],
  );

  const onChangeSettingForSharedNotification = React.useCallback(
    (notificationType: NotificationType, value: boolean) => {
      const notificationId = notificationType.id;
      const valueForReqForKey = (
        key: keyof Omit<SaveSharedNotificationSettingsRequest, 'forUserId'>,
      ) => {
        if (key === notificationId) {
          return value;
        } else {
          return sharedNotificationSettings![key]!;
        }
      };

      saveSharedNotificationSettings({
        forUserId: (notificationUser as AccessibleUserProfile).id,
        timeToDose: valueForReqForKey('timeToDose'),
        takenDose: valueForReqForKey('takenDose'),
        missedDose: valueForReqForKey('missedDose'),
        alexa: valueForReqForKey('alexa'),
        sms: valueForReqForKey('sms'),
        phone: valueForReqForKey('phone'),
        push: valueForReqForKey('push'),
      });
    },
    [
      saveSharedNotificationSettings,
      notificationUser,
      sharedNotificationSettings,
    ],
  );

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={false}>
      <ScrollView>
        <FullWidthContainer
          style={[margin('top', 'p5'), padding('horizontal', 'p3')]}>
          <ScreenTextHeading
            onPressBack={() => navigation.goBack()}
            title={copy.title}
            subtitle=""
          />
          <ListToggle<NotificationUser>
            label={copy.selectorLabel}
            selectedValues={notificationUser ? [notificationUser] : []}
            options={notificationUserOptions}
            getLabelForOption={getLabelForOption}
            getKeyForOption={getKeyForOption}
            onPressOption={setNotificationUser}
            style={margin('bottom', 'p2')}
            closeOnSelect={true}
          />
          {notificationSettings && notificationUser === 'me' ? (
            <MyNotificationSettings
              settings={notificationSettings}
              onChangeSetting={onChangeSettingForUser}
            />
          ) : notificationSettings &&
            sharedNotificationSettings &&
            notificationUser !== 'me' ? (
            <NotificationSettingsForOtherUser
              otherUserName={notificationUser.email}
              settings={notificationSettings}
              sharedSettings={sharedNotificationSettings}
              onChangeSettingForUser={onChangeSettingForUser}
              onChangeSharedSetting={onChangeSettingForSharedNotification}
            />
          ) : null}
        </FullWidthContainer>
      </ScrollView>
    </MedsenseScreen>
  );
};
