import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  deleteMedicationRequest,
  DeleteMedicationRequest,
} from '@app/services/api/medications';

type DeleteMedicationAPI = {
  loading: boolean;
  error?: Error;
  request(variables: DeleteMedicationRequest): void;
};

export const useDeleteMedicationAPI = (
  onSuccess: () => void,
): DeleteMedicationAPI => {
  return useWrappedMedsenseAPIRequest(deleteMedicationRequest, onSuccess);
};
