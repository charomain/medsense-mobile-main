import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  changePasswordRequest,
  ChangePasswordRequest,
} from '@app/services/api/profile';
import {UserProfile} from '@app/models/profile';

type ChangePasswordAPI = {
  loading: boolean;
  error?: Error;
  request(variables: ChangePasswordRequest): void;
  response?: UserProfile;
};

export const useChangePasswordAPI = (
  onSuccess: (response: UserProfile) => void,
): ChangePasswordAPI => {
  return useWrappedMedsenseAPIRequest(changePasswordRequest, onSuccess);
};
