import {UserProfile} from '@app/models/profile';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  UploadPhotoProfileRequest,
  uploadPhotoProfileRequest,
  updateProfileRequest,
  UpdateUserProfileRequest,
  deleteAccountRequest,
} from '@app/services/api/profile';
import {useAuthStore, useSignOut} from '@app/stores/auth';

type SaveProfileAPI = {
  loading: boolean;
  uploading: boolean;
  updateProfile(data: UpdateUserProfileRequest): void;
  updateProfilePhoto(data: UploadPhotoProfileRequest): void;
  deleteAccount(data: {}): void;
};

export const useSaveProfile = (
  onSaveProfile: (profile: UserProfile) => void,
): SaveProfileAPI => {
  const authStore = useAuthStore();
  const {loading, request: updateProfile} = useWrappedMedsenseAPIRequest(
    updateProfileRequest,
    onSaveProfile,
  );

  const {loading: uploading, request: updateProfilePhoto} =
    useWrappedMedsenseAPIRequest(uploadPhotoProfileRequest, () =>
      authStore.fetchProfile(),
    );

  const signOut = useSignOut();

  const {loading: deleting, request: deleteAccount} =
    useWrappedMedsenseAPIRequest(deleteAccountRequest, () => {
      signOut();
    });

  return {
    loading: loading || deleting,
    uploading,
    updateProfile,
    updateProfilePhoto,
    deleteAccount,
  };
};
