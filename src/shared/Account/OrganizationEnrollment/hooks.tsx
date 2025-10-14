import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {sendTenantRequest, SendTenantRequest} from '@app/services/api/profile';

type SaveTenantAPI = {
  loading: boolean;
  updateTenant(data: SendTenantRequest): void;
};

export const useSaveTenant = (onSave: () => void): SaveTenantAPI => {
  const {loading, request: updateTenant} = useWrappedMedsenseAPIRequest(
    sendTenantRequest,
    () => {
      onSave();
    },
  );

  return {
    loading: loading,
    updateTenant,
  };
};
