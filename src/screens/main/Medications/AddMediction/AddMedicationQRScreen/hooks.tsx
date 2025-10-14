import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  addBeaconRequest,
  AddBeaconRequestBody,
  AddedBeacon,
} from '@app/services/api/beacons';

type AddBeaconAPI = {
  loading: boolean;
  error?: Error;
  request(variables: AddBeaconRequestBody): void;
  response?: AddedBeacon[];
};

export const useAddBeaconAPI = (
  onSuccess: (response: AddedBeacon[]) => void,
): AddBeaconAPI => {
  return useWrappedMedsenseAPIRequest(addBeaconRequest, onSuccess);
};
