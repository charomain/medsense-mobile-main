import {useCallback, useState} from 'react';
import {
  useMedsenseAPIRequest,
  useWrappedMedsenseAPIRequest,
} from '@app/services/api';
import {
  fetchDetailStatisticsRequest,
  fetchMedicationAdherenceRequest,
  fetchPRNAdherenceRequest,
  fetchStatisticsRequest,
} from '@app/services/api/insights';
import {getMedicationsRequest} from '@app/services/api/medications';
import {
  convertMedicationListResponseToAdherenceData,
  dosesForMedicationForDates,
  getOverallTakePercentageFromAdherenceData,
  PRNDataByMedication,
} from '@app/models/insights';
import {Medication} from '@app/models/medication';
import {InsightInterval, StatisticResponseModel} from '@app/models/insights';
import {useEffect} from 'react';
import {showErrorAlert} from '@app/shared/utils';
import {fetchUserPrograms} from '@app/services/api/programs';
import {UserProgramEnrollment} from '@app/models/program';

export type InsightMedicationViewModel = {
  percent: number;
  medication: Medication | null;
};

type InsightDataViewModel = {
  overallAdherencePercentage: number;
  medicationAdherence: InsightMedicationViewModel[];
  prnData: PRNDataByMedication;
};

type InsightsAPI = {
  loading: boolean;
  error?: Error;
  adherenceData?: InsightDataViewModel;
  prnData?: PRNDataByMedication;
  apiPeriods: StatisticResponseModel[];
  currentAPIPeriod?: StatisticResponseModel;
  programs?: UserProgramEnrollment[];
  selectAPIPeriod(period: StatisticResponseModel): void;
  fetchPeriods: (
    interval: InsightInterval,
    intervalsToLoad: number,
    startDate: Date,
  ) => void;
};

export const useInsightsAPI = (): InsightsAPI => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<InsightDataViewModel | undefined>(undefined);
  const [apiPeriods, setAPIPeriods] = useState<StatisticResponseModel[]>([]);

  const [selectedAPIPeriod, setSelectedAPIPeriod] = useState<
    StatisticResponseModel | undefined
  >();

  const fetchMedicationAdherence = useMedsenseAPIRequest(
    fetchMedicationAdherenceRequest,
  );
  const fetchDetailStatistics = useMedsenseAPIRequest(
    fetchDetailStatisticsRequest,
  );
  const fetchStatistics = useMedsenseAPIRequest(fetchStatisticsRequest);
  const fetchMedications = useMedsenseAPIRequest(getMedicationsRequest);
  const fetchPRNAdherence = useMedsenseAPIRequest(fetchPRNAdherenceRequest);
  const userProgramApi = useWrappedMedsenseAPIRequest(fetchUserPrograms);

  const fetchPeriods = useCallback(
    async (
      interval: InsightInterval,
      intervalsToLoad: number,
      startDate: Date,
    ) => {
      setLoading(true);
      try {
        const response = await fetchStatistics({
          variables: {
            startDate,
            intervalsToLoad,
            interval,
            medicationId: null,
          },
        });

        response.reverse();
        setAPIPeriods(response);
        if (!selectedAPIPeriod && response[0]) {
          setSelectedAPIPeriod(response[0]);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [fetchStatistics, selectedAPIPeriod],
  );

  const fetchAdherenceForAPIPeriod = useCallback(
    async (apiPeriod: StatisticResponseModel) => {
      setError(undefined);
      setLoading(true);
      try {
        const startDate = apiPeriod.startDate!;
        const endDate = apiPeriod.endDate!;
        const adherence = await fetchMedicationAdherence({
          variables: {
            startDate,
            endDate,
          },
        });

        const detailedStats = await fetchDetailStatistics({
          variables: {
            startDate,
            endDate,
            medicationId: null,
          },
        });

        const medications = await fetchMedications({
          variables: undefined,
        });

        const prnEvents = await fetchPRNAdherence({
          variables: {},
        });

        const prnEventsByMedication = dosesForMedicationForDates(
          medications,
          prnEvents,
        );

        const adherenceData =
          convertMedicationListResponseToAdherenceData(detailedStats);
        const overallAdherencePercentage =
          getOverallTakePercentageFromAdherenceData(adherenceData);
        setData({
          overallAdherencePercentage,
          prnData: prnEventsByMedication,
          medicationAdherence: adherence.map(a => {
            return {
              medication: a.medication,
              percent: a.percent,
            };
          }),
        });
      } catch (err) {
        showErrorAlert(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (selectedAPIPeriod) {
      fetchAdherenceForAPIPeriod(selectedAPIPeriod);
    }

    userProgramApi.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAPIPeriod, fetchAdherenceForAPIPeriod]);

  return {
    fetchPeriods,
    currentAPIPeriod: selectedAPIPeriod,
    selectAPIPeriod: setSelectedAPIPeriod,
    loading: loading || userProgramApi.loading,
    error: error ?? userProgramApi.error,
    adherenceData: data,
    apiPeriods,
    programs: userProgramApi.response ?? [],
  };
};
