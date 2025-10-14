import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  notificationSettingsRequest,
  NotificationSettingsRequest,
  NotificationSettings,
  saveNotificationSettingsRequest,
  SaveNotificationSettingsRequest,
  sharedNotificationSettingsRequest,
  saveSharedNotificationSettingsRequest,
  SaveSharedNotificationSettingsRequest,
} from '@app/services/api/notifications';

type NotificationsAPI = {
  loading: boolean;
  error?: Error;
  fetchNotificationSettings(variables: NotificationSettingsRequest): void;
  fetchSharedNotificationSettings(variables: NotificationSettingsRequest): void;
  notificationSettings?: NotificationSettings;
  sharedNotificationSettings?: NotificationSettings;

  saveNotificationSettings(variables: SaveNotificationSettingsRequest): void;
  saveSharedNotificationSettings(
    variables: SaveSharedNotificationSettingsRequest,
  ): void;
};

export const useNotificationsAPI = (): NotificationsAPI => {
  const notificationSettingsFetchAPI = useWrappedMedsenseAPIRequest(
    notificationSettingsRequest,
  );

  const sharedNotificationSettingsFetchAPI = useWrappedMedsenseAPIRequest(
    sharedNotificationSettingsRequest,
  );

  const saveSharedNotificationSettingsAPI = useWrappedMedsenseAPIRequest(
    saveSharedNotificationSettingsRequest,
  );

  const saveNotificationSettingsAPI = useWrappedMedsenseAPIRequest(
    saveNotificationSettingsRequest,
  );

  return {
    loading:
      notificationSettingsFetchAPI.loading ||
      saveNotificationSettingsAPI.loading ||
      sharedNotificationSettingsFetchAPI.loading ||
      saveSharedNotificationSettingsAPI.loading,
    error:
      notificationSettingsFetchAPI.error ??
      saveNotificationSettingsAPI.error ??
      sharedNotificationSettingsFetchAPI.error ??
      saveSharedNotificationSettingsAPI.error,
    fetchNotificationSettings: notificationSettingsFetchAPI.request,
    fetchSharedNotificationSettings: sharedNotificationSettingsFetchAPI.request,

    notificationSettings:
      saveNotificationSettingsAPI.response ??
      notificationSettingsFetchAPI.response,
    sharedNotificationSettings:
      saveSharedNotificationSettingsAPI.response ??
      sharedNotificationSettingsFetchAPI.response,
    saveNotificationSettings: saveNotificationSettingsAPI.request,
    saveSharedNotificationSettings: saveSharedNotificationSettingsAPI.request,
  };
};
