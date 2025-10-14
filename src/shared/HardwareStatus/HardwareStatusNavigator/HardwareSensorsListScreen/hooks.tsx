import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {getMedicationsRequest} from '@app/services/api/medications';
import {getBeaconsStatus} from '@app/services/api/beacons';
import {BeaconModel, Medication} from '@app/models/medication';
import {useEffect, useMemo} from 'react';
import {FreeBeaconExpanded} from '@app/models/beacon';

export type BeaconWithMedications = FreeBeaconExpanded & {
  medications: Medication[];
};

export type BeaconsAPI = {
  loading: boolean;
  error?: Error;
  beacons?: BeaconWithMedications[];
};

export const useMedicationsAPI = (): BeaconsAPI => {
  const {
    loading,
    error,
    request,
    response: medications,
  } = useWrappedMedsenseAPIRequest(getMedicationsRequest);

  const beaconsAPI = useWrappedMedsenseAPIRequest(getBeaconsStatus);

  useEffect(() => {
    request();
    beaconsAPI.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beacons = useMemo(() => {
    if (!medications || !beaconsAPI.response) {
      return undefined;
    }

    const medicationByBeacons = medications.reduce((accum, medication) => {
      const beaconIds = [medication.beacon]
        .concat(medication.weeklyBeacons)
        .filter((b): b is BeaconModel => !!b)
        .map(b => b.code);

      if (!beaconIds.length) {
        return accum;
      }

      for (let beaconId of beaconIds) {
        if (!accum[beaconId]) {
          accum[beaconId] = [];
        }

        accum[beaconId].push(medication);
      }

      return accum;
    }, {} as {[beaconId: string]: Medication[]});

    return beaconsAPI.response.map((beacon): BeaconWithMedications => {
      return {
        ...beacon,
        medications: medicationByBeacons[`${beacon.uuid}`] ?? [],
      };
    });
  }, [medications, beaconsAPI]);

  return {
    loading: loading || beaconsAPI.loading,
    error,
    beacons,
  };
};
