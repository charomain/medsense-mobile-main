import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {getBeaconsStatus, getHubStatus} from '@app/services/api/beacons';
import {useEffect, useMemo} from 'react';
import {Hub, doesAlertSignifyOnline} from '@app/models/beacon';

type HubAPIData = {
  hubs: Hub[];
  beaconsOnline: boolean;
};

export type BeaconsAPI = {
  loading: boolean;
  error?: Error;
  data?: HubAPIData;
};

export const useHardwareStatusAPI = (): BeaconsAPI => {
  const beaconsAPI = useWrappedMedsenseAPIRequest(getBeaconsStatus);
  const {request, error, loading, response} =
    useWrappedMedsenseAPIRequest(getHubStatus);

  useEffect(() => {
    request();
    beaconsAPI.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo((): HubAPIData | undefined => {
    if (!response || !beaconsAPI.response) {
      return undefined;
    }

    const beaconsOnline = beaconsAPI.response.every(beacon => {
      return doesAlertSignifyOnline(beacon.alert);
    });

    return {
      beaconsOnline,
      hubs: response,
    };
  }, [beaconsAPI, response]);

  return {
    loading: loading || beaconsAPI.loading,
    error,
    data,
  };
};
