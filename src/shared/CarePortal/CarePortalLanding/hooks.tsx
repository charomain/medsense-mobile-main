import {AccessibleUserProfile} from '@app/models/profile';
import {useCarePortalAPIForMe} from '@app/shared/CarePortal/hooks';

type CarePortalAPI = {
  loading: boolean;
  patients?: AccessibleUserProfile[];
  pendingPatients?: AccessibleUserProfile[];
  refetchProfile(): void;
  rejectSharingFrom(user: AccessibleUserProfile): void;
  acceptSharingFrom(user: AccessibleUserProfile): void;
};

export const useCarePortalLandingAPI = (): CarePortalAPI => {
  const fullCarePortalAPI = useCarePortalAPIForMe();

  return {
    loading: fullCarePortalAPI.loading,
    patients: fullCarePortalAPI.patients,
    pendingPatients: fullCarePortalAPI.unconfirmedPatients,
    refetchProfile: fullCarePortalAPI.refresh,
    rejectSharingFrom: fullCarePortalAPI.rejectSharingFrom,
    acceptSharingFrom: fullCarePortalAPI.acceptSharingFrom,
  };
};
