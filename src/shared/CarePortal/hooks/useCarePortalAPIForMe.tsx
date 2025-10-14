import {useAuthStore} from '@app/stores/auth';
import {useCarePortalAPI} from '@app/shared/CarePortal/hooks';
import {CarePortalAPI} from '@app/shared/CarePortal/types';

// loads the patient/caregiver acounts for the main user
export const useCarePortalAPIForMe = (): CarePortalAPI => {
  const authStore = useAuthStore();
  return useCarePortalAPI(
    authStore.profile,
    authStore.fetchProfile,
    authStore.isRefetchingProfile,
  );
};
