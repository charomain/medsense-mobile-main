import {MedsenseAPIRequestFactory} from '../types';
import {MedsenseAPIParsingError} from '../types';
import {
  UserProfile,
  AccessibleUserProfile,
  getTimeZone,
} from '@app/models/profile';
import {parseGenericArray} from './utils';
import {formatDateForServer} from './utils';
import {Platform} from 'react-native';

const parseAccessibleUserProfile = (
  response: Response,
  json: any,
): AccessibleUserProfile => {
  if (json?.id) {
    return {
      id: json.id,
      email: json.email,
      isConfirmed: json.is_confirmed,
      token: json.token,
    };
  }

  throw new MedsenseAPIParsingError('FetchProfile', json, response);
};

const parseProfile = (response: Response, json: any): UserProfile => {
  if (json?.id) {
    return {
      id: json.id,
      photo: json.photo,
      email: json.username,
      gender: json.gender,
      birthday: json.dob ? new Date(json.dob) : null,
      firstName: json.first_name,
      lastName: json.last_name,
      phoneNumber: json.phone_number,
      pushStatus: json.push_status,
      timezone: json.timezone,
      shared: parseGenericArray(
        response,
        json.shared,
        parseAccessibleUserProfile,
      ),
      children: parseGenericArray(
        response,
        json.receives_shares,
        parseAccessibleUserProfile,
      ),
    };
  }

  throw new MedsenseAPIParsingError('FetchProfile', json, response);
};

export const profileRequest: MedsenseAPIRequestFactory<
  undefined,
  UserProfile
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/me',
        method: 'GET',
      };
    },
    parseResponse: parseProfile,
  };
};

export type UpdateUserProfileRequest = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
};

export const updateProfileRequest: MedsenseAPIRequestFactory<
  UpdateUserProfileRequest,
  UserProfile
> = ({variables}) => {
  return {
    createFetchRequest() {
      const body: any = {
        timezone: getTimeZone(),
        username: variables.email,
        first_name: variables.firstName,
        last_name: variables.lastName,
        phone_number: variables.phoneNumber,
        dob: formatDateForServer(variables.dateOfBirth),
      };

      return {
        endpoint: '/profile',
        method: 'PUT',
        sendBodyAs: 'form-data',
        body,
      };
    },
    parseResponse: parseProfile,
  };
};

export type DeleteAccountRequest = {};

export const deleteAccountRequest: MedsenseAPIRequestFactory<
  DeleteAccountRequest,
  void
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/delete',
        method: 'POST',
        sendBodyAs: 'form-data',
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export const updateUserTimezoneRequest: MedsenseAPIRequestFactory<
  {},
  UserProfile
> = ({}) => {
  return {
    createFetchRequest() {
      const body: any = {
        timezone: getTimeZone(),
      };

      return {
        endpoint: '/profile/timezone',
        method: 'PUT',
        sendBodyAs: 'form-data',
        body,
      };
    },
    parseResponse: parseProfile,
  };
};

export type CreateChildAccountRequest = {
  email: string;
};

export const createChildUserRequest: MedsenseAPIRequestFactory<
  CreateChildAccountRequest,
  UserProfile
> = ({variables}) => {
  return {
    createFetchRequest() {
      const timeZone = getTimeZone();
      return {
        endpoint: '/profile/create-family-account',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          username: variables.email,
          timezone: timeZone,
        },
      };
    },
    parseResponse: parseProfile,
  };
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export const changePasswordRequest: MedsenseAPIRequestFactory<
  ChangePasswordRequest,
  UserProfile
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/change-password',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          password: variables.oldPassword,
          new_password: variables.newPassword,
          new_password_repeat: variables.newPassword,
        },
      };
    },
    parseResponse: parseProfile,
  };
};

export type ShareProfileRequest = {
  email: string;
};

export const shareProfileRequest: MedsenseAPIRequestFactory<
  ShareProfileRequest,
  UserProfile
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/share',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          email: variables.email,
        },
      };
    },
    parseResponse: parseProfile,
  };
};

export type StopSharingProfileRequest = {
  userId: number;
};

export const stopSharingProfileRequest: MedsenseAPIRequestFactory<
  StopSharingProfileRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/stop-sharing',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type RejectSharingProfileRequest = {
  userId: number;
};

export const rejectSharingProfileRequest: MedsenseAPIRequestFactory<
  RejectSharingProfileRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/reject-share',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type AcceptSharingProfileRequest = {
  userId: number;
};

export const acceptSharingProfileRequest: MedsenseAPIRequestFactory<
  AcceptSharingProfileRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/confirm-share',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type ReleaseAccessToProfileRequest = {
  userId: number;
};

export const releaseAccessToProfileRequest: MedsenseAPIRequestFactory<
  ReleaseAccessToProfileRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/release-access',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type UploadPhotoProfileRequest = {
  photo: any;
  size: number;
};

export const uploadPhotoProfileRequest: MedsenseAPIRequestFactory<
  UploadPhotoProfileRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      const formData = new FormData();

      formData.append('User[photo]', {
        name: 'image.jpg',
        type: 'image/jpg',
        uri: variables.photo,
        size: variables.size,
      });

      return {
        endpoint: '/profile/load-photo',
        method: 'POST',
        sendBodyAs: 'multipart-form-data',
        body: formData,
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type SendPushTokenRequest = {
  userId: number;
  token: string;
};

export const sendPushTokenRequest: MedsenseAPIRequestFactory<
  SendPushTokenRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/push-token',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          userId: variables.userId,
          type: 'firebase',
          device_type: Platform.OS,
          uuid: null,
          token: variables.token,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};

export type SendTenantRequest = {
  tenantCode: string;
};

export const sendTenantRequest: MedsenseAPIRequestFactory<
  SendTenantRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/profile/tenant',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          tenant_code: variables.tenantCode,
        },
      };
    },
    parseResponse(_resp, _json) {},
  };
};
