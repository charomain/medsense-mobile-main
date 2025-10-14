import {useCallback, useState} from 'react';
import {useMedsenseAPIRequest} from '@app/services/api';
import {
  InsightRunChartDatum,
  fetchDetailStatisticsRequest,
  fetchRunChartDataRequest,
  fetchStatisticsRequest,
} from '@app/services/api/insights';
import {
  convertMedicationListResponseToAdherenceData,
  AdherenceDataForDate,
} from '@app/models/insights';
import {Medication} from '@app/models/medication';
import {InsightInterval, StatisticResponseModel} from '@app/models/insights';
import {useEffect} from 'react';

export type InsightMedicationViewModel = {
  percent: number;
  medication: Medication | null;
};

type InsightsAPI = {
  loading: boolean;
  error?: Error;
  adherenceData?: AdherenceDataForDate[];
  apiPeriods: StatisticResponseModel[];
  currentAPIPeriod?: StatisticResponseModel;
  runChartData?: InsightRunChartDatum[];
  selectAPIPeriod(period: StatisticResponseModel): void;
  fetchPeriods: (
    interval: InsightInterval,
    intervalsToLoad: number,
    startDate: Date,
  ) => void;
};

export const useInsightsAPI = (
  medicationId: number | null = null,
): InsightsAPI => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<AdherenceDataForDate[] | undefined>(
    undefined,
  );

  const [runChartData, setRunChartData] = useState<
    InsightRunChartDatum[] | undefined
  >(undefined);

  const [apiPeriods, setAPIPeriods] = useState<StatisticResponseModel[]>([]);

  const [selectedAPIPeriod, setSelectedAPIPeriod] = useState<
    StatisticResponseModel | undefined
  >();

  const fetchDetailStatistics = useMedsenseAPIRequest(
    fetchDetailStatisticsRequest,
  );
  const fetchStatistics = useMedsenseAPIRequest(fetchStatisticsRequest);
  const fetchRunChartData = useMedsenseAPIRequest(fetchRunChartDataRequest);

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
            medicationId,
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
    [fetchStatistics, selectedAPIPeriod, medicationId],
  );

  const fetchAdherenceForAPIPeriod = useCallback(
    async (apiPeriod: StatisticResponseModel) => {
      setError(undefined);
      setLoading(true);
      try {
        const startDate = apiPeriod.startDate!;
        const endDate = apiPeriod.endDate!;

        const [detailedStats, runChartDatums] = await Promise.all([
          fetchDetailStatistics({
            variables: {
              startDate,
              endDate,
              medicationId,
            },
          }),
          medicationId
            ? fetchRunChartData({
                variables: {
                  startDate,
                  endDate,
                  medicationId,
                },
              })
            : null,
        ]);

        const adherenceData =
          convertMedicationListResponseToAdherenceData(detailedStats);
        setData(adherenceData);
        if (runChartDatums) {
          setRunChartData(runChartDatums);
        }
      } catch (err) {
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
  }, [selectedAPIPeriod, fetchAdherenceForAPIPeriod]);

  return {
    fetchPeriods,
    currentAPIPeriod: selectedAPIPeriod,
    selectAPIPeriod: setSelectedAPIPeriod,
    loading,
    error,
    adherenceData: data,
    apiPeriods,
    runChartData,
  };
};
