import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {profileRequest} from '@app/services/api/profile';
import {useCarePortalAPI} from '@app/shared/CarePortal/hooks';
import {CarePortalAPI} from '@app/shared/CarePortal/types';
import {useEffect, useCallback} from 'react';
import {usePatientContext} from '@app/contexts/patient';
import {AccessibleUserProfile, UserProfile} from '@app/models/profile';

export const useCareGiverAPIForPatient = (): CarePortalAPI => {
  const patientContext = usePatientContext();
  if (!patientContext) {
    throw new Error('No patient context on required screen');
  }

  return useCarePortalAPI(
    patientContext.profile ?? null,
    patientContext.refetch,
    patientContext.loading,
  );
};

type FetchProfileAPI = {
  loading: boolean;
  profile?: UserProfile;
  refetch(): void;
};

export const useFetchProfile = (
  profile: AccessibleUserProfile,
): FetchProfileAPI => {
  const profileAPI = useWrappedMedsenseAPIRequest(profileRequest);

  const fetchProfile = useCallback(() => {
    profileAPI.request(undefined, profile.token!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    loading: profileAPI.loading,
    profile: profileAPI.response,
    refetch: fetchProfile,
  };
};
