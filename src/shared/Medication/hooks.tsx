import {useContext, useEffect} from 'react';
import {
  useWrappedMedsenseAPIRequest,
  useMedsenseAPIRequest,
} from '@app/services/api';
import {
  getMedicationTypesRequest,
  getDosageTypesRequest,
  uploadMedicationPhotoRequest,
  getSmartBoxCreditsRequest,
  reloadSmartBoxCreditsRequest,
  resetSmartBoxCreditsRequest,
  SmartBoxCreditsRequest,
} from '@app/services/api/medications';
import {
  batchSaveSchedulesRequest,
  ScheduleDTO,
  batchSaveScheduleTimesRequest,
} from '@app/services/api/schedules';
import {
  assignBeaconRequest,
  getBeaconsRequest,
  getFreeWeeklyBeaconsRequest,
  assignWeeklyBeaconRequest,
} from '@app/services/api/beacons';
import {
  MedicationTypeModel,
  DosageTypeModel,
  Medication,
  RETAINER_CONTAINER_ID,
  isSmartBoxMedication,
} from '@app/models/medication';
import {
  getMedicationContainersRequest,
  ScheduleType,
  SaveMedicationRequest,
  saveMedicationRequest,
} from '@app/services/api/medications';
import {MedicationContainer} from '@app/models/medication';
import {useCallback, useMemo, useState} from 'react';
import {
  isMedicationMultiBeacon,
  isMedicationPRN,
  isUploadedPhoto,
  MedicationViewModel,
} from '@app/shared/Medication/model';
import {
  BeaconColor,
  FreeBeaconModel,
  getWeeklyBeaconFillCount,
  WeeklyBeaconType,
  WEEKLY_BEACON_DAY_ABBRV_MAPPING,
  WEEKLY_BEACON_DAY_VALUE_MAPPING,
} from '@app/models/beacon';
import {showErrorAlert} from '@app/shared/utils';
import {resizePhoto} from '@app/services/api/utils';
import {fixFilePath, isDefined} from '@app/models/common';
import {getMedicationsRequest} from '@app/services/api/medications';
import {TenantContext} from '@app/contexts/tenant';
import {useBeaconSetsApi} from './beaconSetsHooks';
import {NormalizedBeaconSet} from '@app/models/beacon';

type MedicationTaxonomiesAPI = {
  loading: boolean;
  error?: Error;
  data?: {
    medicationTypes: MedicationTypeModel[];
    dosageTypes: DosageTypeModel[];
    containerTypes: MedicationContainer[];
    beacons: FreeBeaconModel[];
    beaconSets: NormalizedBeaconSet[];
  };
};

export const useMedicationTaxonomiesAPI = (): MedicationTaxonomiesAPI => {
  const {request: requestMedicationType, ...medicationTypeApi} =
    useWrappedMedsenseAPIRequest(getMedicationTypesRequest);

  const {request: requestDosageTypeModel, ...dosageTypeApi} =
    useWrappedMedsenseAPIRequest(getDosageTypesRequest);

  const {request: requestContainerTypes, ...containersApi} =
    useWrappedMedsenseAPIRequest(getMedicationContainersRequest);

  const {request: requestBeacons, ...beaconsApi} =
    useWrappedMedsenseAPIRequest(getBeaconsRequest);

  const weeklyBeaconsApi = useBeaconSetsApi();

  const tenantContext = useContext(TenantContext);
  const blacklisted = useMemo(() => {
    if (tenantContext?.tenant === 'toothcase') {
      return new Set();
    } else {
      const BLACKLISTED_CONTAINER_IDS = new Set<number>([
        RETAINER_CONTAINER_ID, // Retainer case
      ]);
      return BLACKLISTED_CONTAINER_IDS;
    }
  }, [tenantContext]);

  useEffect(() => {
    requestMedicationType();
    requestDosageTypeModel();
    requestContainerTypes();
    requestBeacons();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    const medicationTypes = medicationTypeApi.response;
    const dosageTypes = dosageTypeApi.response;
    const containerTypes = containersApi.response?.filter(
      c => !blacklisted.has(c.id),
    );
    const beacons = beaconsApi.response;
    const beaconSets = weeklyBeaconsApi.beaconSets;
    if (
      medicationTypes &&
      dosageTypes &&
      containerTypes &&
      beacons &&
      beaconSets
    ) {
      return {
        medicationTypes,
        dosageTypes,
        containerTypes,
        beacons,
        beaconSets,
      };
    }
  }, [
    medicationTypeApi,
    weeklyBeaconsApi,
    dosageTypeApi,
    containersApi,
    beaconsApi,
    blacklisted,
  ]);

  return {
    loading:
      medicationTypeApi.loading ||
      dosageTypeApi.loading ||
      containersApi.loading ||
      weeklyBeaconsApi.loading ||
      beaconsApi.loading,
    error:
      medicationTypeApi.error ??
      dosageTypeApi.error ??
      containersApi.error ??
      weeklyBeaconsApi.error ??
      beaconsApi.error,
    data,
  };
};

type SaveMedicationAPI = {
  loading: boolean;
  error: Error | null;
  saveMedication(medication: MedicationViewModel): void;
};

export const useSaveMedicationAPI = (
  existingMedication: Medication | null,
  onSaveSuccess: (
    showAddAnotherPopup: boolean,
    savedMedication: MedicationViewModel,
    savedMedicationFromAPI: Medication,
  ) => void,
): SaveMedicationAPI => {
  const saveMedication = useMedsenseAPIRequest(saveMedicationRequest);
  const uploadMedication = useMedsenseAPIRequest(uploadMedicationPhotoRequest);
  const batchSaveSchedules = useMedsenseAPIRequest(batchSaveSchedulesRequest);
  const batchSaveTimes = useMedsenseAPIRequest(batchSaveScheduleTimesRequest);
  const assignBeacon = useMedsenseAPIRequest(assignBeaconRequest);
  const assignWeeklyBeacon = useMedsenseAPIRequest(assignWeeklyBeaconRequest);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveMedicationWrapped = useCallback(
    async (medication: MedicationViewModel) => {
      const apiParams = convertViewModelForAPI(medication);
      setLoading(true);
      try {
        const savedMedication = await saveMedication({variables: apiParams});

        if (!isMedicationPRN(medication)) {
          await batchSaveSchedules({
            variables: {
              schedules: convertViewModelForSchedulesAPI(medication) ?? [],
              medicationId: savedMedication.id,
            },
          });
        }

        if (medication.dosageTimes && !isMedicationPRN(medication)) {
          await batchSaveTimes({
            variables: {
              medicationId: savedMedication.id,
              times: medication.dosageTimes,
            },
          });
        }

        const weeklyBeaconTypes = getWeeklyBeaconTypesForAPI(medication);
        if (medication.container?.isPillOrganizer && weeklyBeaconTypes) {
          for (let organizer of medication.organizers!) {
            const beacons = weeklyBeaconTypes.map(beaconType => {
              const matched = organizer.beacons.find(
                beacon => beacon.name === beaconType,
              );
              if (!matched) {
                throw new Error('Invalid sensor selected');
              }

              return {
                beaconName: matched.name,
                beaconCode: matched.uuid,
              };
            });

            await assignWeeklyBeacon({
              variables: {
                medicationId: savedMedication.id,
                beacons,
              },
            });
          }
        } else if (medication.beacon) {
          if (
            (existingMedication &&
              existingMedication.beacon?.id !== medication.beacon.beaconId) ||
            !existingMedication
          ) {
            await assignBeacon({
              variables: {
                medicationId: savedMedication.id,
                beaconCode: medication.beacon.uuid,
                beaconName: medication.beacon.name,
              },
            });
          }
        }

        if (medication.photo && !isUploadedPhoto(medication.photo)) {
          const resized = await resizePhoto(
            fixFilePath(medication.photo.path),
            500,
            500,
          );

          await uploadMedication({
            variables: {
              medicationId: savedMedication.id,
              photoPath: fixFilePath(resized.uri),
            },
          });
        }

        onSaveSuccess(
          isMedicationMultiBeacon(medication),
          medication,
          savedMedication,
        );
      } catch (e) {
        console.log('ERROR', e);
        showErrorAlert(e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      saveMedication,
      assignBeacon,
      batchSaveTimes,
      batchSaveSchedules,
      uploadMedication,
      onSaveSuccess,
      existingMedication,
      assignWeeklyBeacon,
    ],
  );

  return {
    loading,
    error,
    saveMedication: saveMedicationWrapped,
  };
};

const convertViewModelScheduleForAPI = (
  model: MedicationViewModel,
): ScheduleType | undefined => {
  switch (model.scheduleFrequencyInterval?.type) {
    case 'daily':
      return 'daily';
    case 'recurring-interval':
      return 'period';
    case 'specific-days':
      return 'weekly';
    case 'as-needed':
      return 'prn';
  }
};

export const getWeeklyBeaconTypesForAPI = (
  model: MedicationViewModel,
): WeeklyBeaconType[] | null => {
  const frequency = model.scheduleFrequencyInterval;
  if (!frequency) {
    return [];
  }

  if (frequency.type === 'daily') {
    return [
      WeeklyBeaconType.sunday,
      WeeklyBeaconType.monday,
      WeeklyBeaconType.tuesday,
      WeeklyBeaconType.wednesday,
      WeeklyBeaconType.thursday,
      WeeklyBeaconType.friday,
      WeeklyBeaconType.saturday,
    ];
  } else if (frequency.type === 'recurring-interval') {
    return frequency.intervals!.map(
      i => WEEKLY_BEACON_DAY_VALUE_MAPPING[i] ?? 0,
    );
  } else if (frequency.type === 'as-needed') {
    return null;
  } else {
    return frequency.days!.map(i => WEEKLY_BEACON_DAY_ABBRV_MAPPING[i] ?? 0);
  }
};

export const getFreeWeeklyBeacons = (
  weeklyBeacons: FreeBeaconModel[],
  isNewOrganizer: boolean,
) => {
  const uniqueIds = new Set<number>(
    weeklyBeacons.map(b => b.weeklyBeaconSetId).filter(isDefined),
  );
  if (isNewOrganizer) {
    const filledSets = getWeeklyBeaconFillCount(weeklyBeacons);
    const unusedId = Object.entries(filledSets).find(
      ([_beaconId, count]) => count !== 7,
    );

    if (unusedId) {
      return weeklyBeacons.filter(
        x => !x.used && x.weeklyBeaconSetId === Number(unusedId[0]),
      );
    } else {
      return null;
    }
  } else {
    return weeklyBeacons.filter(x => uniqueIds.has(x.weeklyBeaconSetId!));
  }
};

export const convertViewModelForAPI = (
  model: MedicationViewModel,
): SaveMedicationRequest => {
  const params: SaveMedicationRequest = {
    id: model.id,
    scheduleType: convertViewModelScheduleForAPI(model)!,
    name: model.name,
    medicationTypeId: model.medicationType?.id!,
    dosage: model.dosageQuantity == null ? undefined : model.dosageQuantity,
    dosageTypeId: model.dosageType?.id,
    pushOnlyForget: model.notificationType === 'when-i-forget',
    information: undefined,
    colorTypeId: model.container?.isPillOrganizer
      ? BeaconColor.organizer
      : model.beacon?.colorTypeId ?? 1,
    medicationCategoryId: model.container?.id!,
  };

  return params;
};

export const convertViewModelForSchedulesAPI = (
  model: MedicationViewModel,
): ScheduleDTO[] | undefined => {
  switch (model.scheduleFrequencyInterval?.type) {
    case 'daily':
      return [{periodRange: 1}];
    case 'recurring-interval':
      return model.scheduleFrequencyInterval.intervals?.map(i => ({
        periodRange: i,
      }));
    case 'specific-days':
      return model.scheduleFrequencyInterval.days?.map(i => ({weekDay: i}));
  }
};

type MedicationsAPI = {
  loading: boolean;
  error?: Error;
  medications?: Medication[];
  search(query: string): void;
  clearSearch(): void;
  refetch(): void;
  hasFreeBeacons: boolean;
  reload(request: SmartBoxCreditsRequest): void;
  reset(request: SmartBoxCreditsRequest): void;
};

export const useMedicationsAPI = (): MedicationsAPI => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const request = useMedsenseAPIRequest(getMedicationsRequest);

  const requestCredits = useMedsenseAPIRequest(getSmartBoxCreditsRequest);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<Medication[] | null>(null);

  const beaconsAPI = useWrappedMedsenseAPIRequest(getBeaconsRequest);

  const weeklyBeaconsAPI = useWrappedMedsenseAPIRequest(
    getFreeWeeklyBeaconsRequest,
  );

  const hasFreeBeacons = useMemo(() => {
    return !!(weeklyBeaconsAPI.response?.length || beaconsAPI.response?.length);
  }, [beaconsAPI, weeklyBeaconsAPI]);

  const clearSearch = useCallback(() => {
    setSearchQuery(null);
  }, [setSearchQuery]);

  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      const medications = await request({
        variables: undefined,
      });

      const finalData = await Promise.all(
        medications.map(async medication => {
          if (!isSmartBoxMedication(medication)) {
            return medication;
          }

          const creditResponse = await requestCredits({
            variables: {
              medicationId: medication.id,
            },
          });

          return {
            ...medication,
            credits: creditResponse.balance,
          };
        }),
      );

      setData(finalData);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadApi = useWrappedMedsenseAPIRequest(reloadSmartBoxCreditsRequest);
  const resetApi = useWrappedMedsenseAPIRequest(resetSmartBoxCreditsRequest);

  useEffect(() => {
    fetchMedications();
    beaconsAPI.request();
    weeklyBeaconsAPI.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    setSearchQuery(null);
    fetchMedications();
    beaconsAPI.request();
    weeklyBeaconsAPI.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const medications = useMemo(() => {
    if (!data) {
      return undefined;
    }

    if (!searchQuery) {
      return data;
    }

    return data.filter(m =>
      m.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()),
    );
  }, [searchQuery, data]);

  return {
    loading:
      loading ||
      beaconsAPI.loading ||
      weeklyBeaconsAPI.loading ||
      reloadApi.loading ||
      resetApi.loading,
    error: error ?? reloadApi.error ?? resetApi.error,
    clearSearch,
    search: setSearchQuery,
    medications,
    refetch,
    hasFreeBeacons,
    reload: reloadApi.request,
    reset: resetApi.request,
  };
};
