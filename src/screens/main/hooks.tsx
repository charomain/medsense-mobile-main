import {PermissionsAndroid} from 'react-native';
import {useEffect} from 'react';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  updateUserTimezoneRequest,
  sendPushTokenRequest,
} from '@app/services/api/profile';
import messaging from '@react-native-firebase/messaging';
import {useProfile} from '@app/stores/auth';
import {Platform} from 'react-native';
import {getHubStatus} from '@app/services/api/beacons';
import {doesAlertSignifyOnline} from '@app/models/beacon';
import {useHubSettings} from '@app/stores/hub';

async function requestUserPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (err) {
      console.error(err);
    }
    return true;
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
}

export const useSyncProfileAPI = () => {
  const profile = useProfile();

  const {request: syncTimezoneRequest} = useWrappedMedsenseAPIRequest(
    updateUserTimezoneRequest,
  );

  const {request: sendPushToken} =
    useWrappedMedsenseAPIRequest(sendPushTokenRequest);

  useEffect(() => {
    syncTimezoneRequest({});

    const syncNotificationToken = async () => {
      const enabled = await requestUserPermission();
      if (!enabled) {
        return;
      }

      const token = await messaging().getToken();
      return sendPushToken({
        userId: profile.id,
        token,
      });
    };

    syncNotificationToken();

    const timer = setInterval(() => {
      syncTimezoneRequest({});
    }, 1000 * 60 * 60 * 6); // Refresh timezone every 6 hours

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncTimezoneRequest]);
};

export const useHubStatusEffect = () => {
  const {request, response} = useWrappedMedsenseAPIRequest(getHubStatus);
  const hubLocalSettings = useHubSettings();

  useEffect(() => {
    request();
  }, [request]);

  useEffect(() => {
    if (
      !response ||
      !hubLocalSettings.hubSettings ||
      !hubLocalSettings.hubSettings.hasSetup
    ) {
      return;
    }

    const anyHubOffline = response.some(hubStatus => {
      return !doesAlertSignifyOnline(hubStatus.alert);
    });

    if (anyHubOffline) {
      hubLocalSettings.setHubSettings({
        hasSetup: false,
      });
    }
  }, [response, hubLocalSettings]);
};
