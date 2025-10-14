import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  createChildUserRequest,
  CreateChildAccountRequest,
} from '@app/services/api/profile';
import {UserProfile} from '@app/models/profile';

type CreateChildAccountAPI = {
  loading: boolean;
  error?: Error;
  request(variables: CreateChildAccountRequest): void;
  response?: UserProfile;
};

export const useCreateChildAccountAPI = (
  onSuccess: (response: UserProfile) => void,
): CreateChildAccountAPI => {
  return useWrappedMedsenseAPIRequest(createChildUserRequest, onSuccess);
};
