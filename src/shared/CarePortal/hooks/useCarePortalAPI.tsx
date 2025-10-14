import * as React from 'react';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  shareProfileRequest,
  stopSharingProfileRequest,
  rejectSharingProfileRequest,
  acceptSharingProfileRequest,
  releaseAccessToProfileRequest,
} from '@app/services/api/profile';
import {
  AccessibleUserProfile,
  isConfirmed,
  UserProfile,
} from '@app/models/profile';
import {CarePortalAPI} from '../types';

const splitArray = <T,>(
  mixedArray: T[],
  predicate: (x: T) => boolean,
): [T[], T[]] => {
  return mixedArray.reduce(
    (result, el) => {
      if (predicate(el)) {
        result[0].push(el);
      } else {
        result[1].push(el);
      }

      return result;
    },
    [[] as T[], [] as T[]],
  );
};

export const useCarePortalAPI = (
  profile: UserProfile | null,
  refetchProfile: () => void,
  isRefreshingProfile: boolean,
): CarePortalAPI => {
  const stopSharingProfileAPI = useWrappedMedsenseAPIRequest(
    stopSharingProfileRequest,
    refetchProfile,
  );
  const stopSharingWith = React.useCallback(
    (item: AccessibleUserProfile) => {
      stopSharingProfileAPI.request({
        userId: item.id,
      });
    },
    [stopSharingProfileAPI],
  );

  const shareProfileAPI = useWrappedMedsenseAPIRequest(
    shareProfileRequest,
    refetchProfile,
  );
  const shareProfileWith = React.useCallback(
    (email: string) => {
      return shareProfileAPI.request({email});
    },
    [shareProfileAPI],
  );

  const acceptSharingProfileAPI = useWrappedMedsenseAPIRequest(
    acceptSharingProfileRequest,
    refetchProfile,
  );
  const acceptSharingFrom = React.useCallback(
    (item: AccessibleUserProfile) => {
      acceptSharingProfileAPI.request({
        userId: item.id,
      });
    },
    [acceptSharingProfileAPI],
  );

  const rejectSharingProfileAPI = useWrappedMedsenseAPIRequest(
    rejectSharingProfileRequest,
    refetchProfile,
  );
  const rejectSharingFrom = React.useCallback(
    (item: AccessibleUserProfile) => {
      rejectSharingProfileAPI.request({
        userId: item.id,
      });
    },
    [rejectSharingProfileAPI],
  );

  const releaseAccessToProfileAPI = useWrappedMedsenseAPIRequest(
    releaseAccessToProfileRequest,
    refetchProfile,
  );

  const releaseAccessTo = React.useCallback(
    (item: AccessibleUserProfile) => {
      releaseAccessToProfileAPI.request({
        userId: item.id,
      });
    },
    [releaseAccessToProfileAPI],
  );

  const [patients, unconfirmedPatients] = React.useMemo(() => {
    if (!profile?.children) {
      return [undefined, undefined];
    }

    return splitArray(profile?.children, isConfirmed);
  }, [profile]);

  const [careGivers, unconfirmedCareGivers] = React.useMemo(() => {
    if (!profile?.shared) {
      return [undefined, undefined];
    }

    return splitArray(profile?.shared, isConfirmed);
  }, [profile]);

  return {
    loading:
      shareProfileAPI.loading ||
      stopSharingProfileAPI.loading ||
      rejectSharingProfileAPI.loading ||
      acceptSharingProfileAPI.loading ||
      releaseAccessToProfileAPI.loading ||
      isRefreshingProfile,
    error:
      shareProfileAPI.error ??
      stopSharingProfileAPI.error ??
      rejectSharingProfileAPI.error ??
      releaseAccessToProfileAPI.error ??
      acceptSharingProfileAPI.error,

    acceptSharingFrom,
    stopSharingWith,
    shareProfileWith,
    rejectSharingFrom,
    releaseAccessTo,
    patients,
    careGivers,
    unconfirmedPatients,
    unconfirmedCareGivers,
    refresh: refetchProfile,
  };
};
