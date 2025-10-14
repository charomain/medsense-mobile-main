import {useCallback} from 'react';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {takeNowRequest} from '@app/services/api/medications';

type TakeNowAPI = {
  loading: boolean;
  error?: Error;
  recordTaken(medicationId: number): void;
};

export const useTakeNowAPI = (onSuccess: () => void): TakeNowAPI => {
  const {loading, error, request} = useWrappedMedsenseAPIRequest(
    takeNowRequest,
    onSuccess,
  );
  const recordTaken = useCallback(
    (medicationId: number) => {
      request({
        medicationId,
      });
    },
    [request],
  );

  return {
    loading,
    error,
    recordTaken,
  };
};
