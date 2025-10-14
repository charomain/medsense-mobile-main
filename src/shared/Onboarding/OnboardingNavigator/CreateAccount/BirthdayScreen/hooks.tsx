import {UserProfile} from '@app/models/profile';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  updateProfileRequest,
  UpdateUserProfileRequest,
} from '@app/services/api/profile';
import {useAuthStore} from '@app/stores/auth';

type SaveProfileAPI = {
  loading: boolean;
  updateProfile(data: UpdateUserProfileRequest): void;
};

export const useSaveProfile = (
  onSaveProfile: (profile: UserProfile) => void,
): SaveProfileAPI => {
  const authStore = useAuthStore();
  const {loading, request: updateProfile} = useWrappedMedsenseAPIRequest(
    updateProfileRequest,
    profile => {
      authStore.setProfile(profile);
      onSaveProfile(profile);
    },
  );

  return {
    loading: loading,
    updateProfile,
  };
};
