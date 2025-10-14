import {MedsenseAPIRequestFactory} from '../types';

export type NotificationSettings = {
  alexa: boolean | null;
  sms: boolean | null;
  phone: boolean | null;
  phoneSelf: boolean | null;
  push: boolean | null;
  confirmatory: boolean | null;
  timeToDose: boolean | null;
  takenDose: boolean | null;
  missedDose: boolean | null;
};

const parseNotificationResponse = (
  _resp: Response,
  json: any,
): NotificationSettings => {
  const result: NotificationSettings = {
    alexa: json.alexaNotification,
    sms: json.smsNotification,
    phone: json.phoneNotification,
    phoneSelf: json.phoneCallNotification,
    push: json.pushNotification,
    confirmatory: json.confirmatory,
    timeToDose: json.timeToDoseNotification,
    takenDose: json.takenDoseNotification,
    missedDose: json.missedDoseNotification,
  };

  return result;
};

export type NotificationSettingsRequest = {
  userId: number;
};

export const notificationSettingsRequest: MedsenseAPIRequestFactory<
  NotificationSettingsRequest,
  NotificationSettings
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/profile/notifications/${variables.userId}`,
        method: 'GET',
      };
    },
    parseResponse: parseNotificationResponse,
  };
};

export const sharedNotificationSettingsRequest: MedsenseAPIRequestFactory<
  NotificationSettingsRequest,
  NotificationSettings
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/profile/shared-notifications/${variables.userId}`,
        method: 'GET',
      };
    },
    parseResponse: parseNotificationResponse,
  };
};

export type SaveNotificationSettingsRequest = {
  userId: number;
  confirmatory: boolean;
  phone: boolean;
  alexa: boolean;
  sms: boolean;
  push: boolean;
};

const boolTo1or0 = (v: boolean) => (v ? 1 : 0);

export const saveNotificationSettingsRequest: MedsenseAPIRequestFactory<
  SaveNotificationSettingsRequest,
  NotificationSettings
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/profile/notifications/${variables.userId}`,
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
          confirmatory: boolTo1or0(variables.confirmatory),
          phoneNotification: boolTo1or0(variables.phone),
          alexaNotification: boolTo1or0(variables.alexa),
          smsNotification: boolTo1or0(variables.sms),
          pushNotification: boolTo1or0(variables.push),
        },
      };
    },
    parseResponse: parseNotificationResponse,
  };
};

export type SaveSharedNotificationSettingsRequest = {
  forUserId: number;
  timeToDose: boolean;
  takenDose: boolean;
  missedDose: boolean;
  alexa: boolean;
  sms: boolean;
  phone: boolean;
  push: boolean;
};

export const saveSharedNotificationSettingsRequest: MedsenseAPIRequestFactory<
  SaveSharedNotificationSettingsRequest,
  NotificationSettings
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/profile/shared-notifications/${variables.forUserId}`,
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.forUserId,
          timeToDoseNotification: boolTo1or0(variables.timeToDose),
          takenDoseNotification: boolTo1or0(variables.takenDose),
          missedDoseNotification: boolTo1or0(variables.missedDose),
          alexaNotification: boolTo1or0(variables.alexa),
          smsNotification: boolTo1or0(variables.sms),
          phoneNotification: boolTo1or0(variables.phone),
          pushNotification: boolTo1or0(variables.push),
        },
      };
    },
    parseResponse: parseNotificationResponse,
  };
};
