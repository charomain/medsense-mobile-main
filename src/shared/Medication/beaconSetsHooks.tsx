import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {
  getFreeWeeklyBeaconsRequest,
  getBeaconSets,
} from '@app/services/api/beacons';
import {useEffect, useMemo} from 'react';
import {NormalizedBeaconSet} from '@app/models/beacon';

type BeaconSetApi = {
  loading: boolean;
  error?: Error;
  beaconSets?: NormalizedBeaconSet[];
};

export const useBeaconSetsApi = (): BeaconSetApi => {
  const {request: requestWeeklyBeacons, ...weeklyBeaconsApi} =
    useWrappedMedsenseAPIRequest(getFreeWeeklyBeaconsRequest);

  const {request: requestBeaconSets, ...beaconSetsApi} =
    useWrappedMedsenseAPIRequest(getBeaconSets);

  useEffect(() => {
    requestWeeklyBeacons();
    requestBeaconSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beaconSets = useMemo(() => {
    if (!weeklyBeaconsApi.response || !beaconSetsApi.response) {
      return undefined;
    }

    const weeklyBeaconsById = new Map(
      weeklyBeaconsApi.response.map(b => [b.beaconId, b]),
    );
    return beaconSetsApi.response.map((set): NormalizedBeaconSet => {
      return {
        id: set.id,
        name: set.name,
        beacons: set.beacons.map(beacon => {
          const weeklyBeacon = weeklyBeaconsById.get(beacon.id);
          if (!weeklyBeacon) {
            throw new Error(
              `Unable to find beacon ${beacon.id} for set ID ${beacon.id}`,
            );
          }

          return {
            ...weeklyBeacon,
            day: beacon.day,
          };
        }),
      };
    });
  }, [beaconSetsApi, weeklyBeaconsApi]);

  return {
    loading: weeklyBeaconsApi.loading || beaconSetsApi.loading,
    error: weeklyBeaconsApi.error ?? beaconSetsApi.error,
    beaconSets,
  };
};
