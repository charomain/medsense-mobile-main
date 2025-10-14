import {MedsenseAPIRequestFactory} from '../types';
import {parseGenericArray} from './utils';
import {formatDateForServer, parseDate} from './utils';
import {parseMedication, parseColorTypeModel} from './medications';
import {Medication} from '@app/models/medication';
import {
  InsightInterval,
  PRNAdherenceEvent,
  StatisticResponse,
} from '@app/models/insights';
import {subDays} from 'date-fns';

export type MedicationAdherenceRequest = {
  startDate: Date;
  endDate: Date;
};

const parseStatisticResponseRow = (
  response: Response,
  json: any,
): StatisticResponse[0] => {
  const colorType = json.colorType
    ? parseColorTypeModel(response, json.colorType)
    : null;
  let medication: Medication | null = null;
  if (json.medicament) {
    medication = parseMedication(response, json.medicament);
    if (colorType) {
      medication.colorType = colorType;
    }
  }

  return {
    startDate: json.start_date ? parseDate(response, json, 'start_date') : null,
    endDate: json.end_date ? parseDate(response, json, 'end_date') : null,
    percent: Number(json.percent),
    medication,
  };
};

export const fetchMedicationAdherenceRequest: MedsenseAPIRequestFactory<
  MedicationAdherenceRequest,
  StatisticResponse
> = ({variables}) => {
  return {
    createFetchRequest() {
      const queryString = new URLSearchParams({
        start_date: formatDateForServer(variables.startDate),
        end_date: formatDateForServer(variables.endDate),
        expand: 'medicament, colorType',
      });

      return {
        endpoint: `/statistics/medicaments?${queryString.toString()}`,
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseStatisticResponseRow);
    },
  };
};

type DetailStatisticsRequest = {
  medicationId: number | null;
  startDate: Date;
  endDate: Date;
};

export const fetchDetailStatisticsRequest: MedsenseAPIRequestFactory<
  DetailStatisticsRequest,
  Medication[]
> = ({variables}) => {
  return {
    createFetchRequest() {
      const queryString = new URLSearchParams({
        start_date: formatDateForServer(variables.startDate),
        end_date: formatDateForServer(variables.endDate),
      });

      let endpoint: string;
      if (variables.medicationId) {
        endpoint = `/statistics/${
          variables.medicationId
        }/details?${queryString.toString()}`;
      } else {
        endpoint = `/statistics/details?${queryString.toString()}`;
      }

      return {
        endpoint,
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseMedication);
    },
  };
};

type FetchStatisticsRequest = {
  medicationId: number | null;
  interval: InsightInterval;
  intervalsToLoad: number;
  startDate: Date;
};

const pathForInterval = (interval: InsightInterval) => {
  switch (interval) {
    case InsightInterval.daily:
      return '/daily';
    case InsightInterval.weekly:
      return '/weekly';
    case InsightInterval.monthly:
      return '/monthly';
  }
};

const getDaysForInterval = (interval: InsightInterval, intervals: number) => {
  switch (interval) {
    case InsightInterval.daily:
      return intervals;
    case InsightInterval.weekly:
      return intervals * 7;
    case InsightInterval.monthly:
      return intervals * 30;
  }
};

export const fetchStatisticsRequest: MedsenseAPIRequestFactory<
  FetchStatisticsRequest,
  StatisticResponse
> = ({variables}) => {
  return {
    createFetchRequest() {
      const {medicationId, interval, intervalsToLoad, startDate} = variables;
      const daysBack = getDaysForInterval(interval, intervalsToLoad);

      const queryString = new URLSearchParams({
        start_date: formatDateForServer(subDays(startDate, daysBack)),
        end_date: formatDateForServer(startDate),
      });

      return {
        endpoint:
          '/statistics' +
          (medicationId ? `/${medicationId}` : '') +
          pathForInterval(interval) +
          '?' +
          queryString.toString(),
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseStatisticResponseRow);
    },
  };
};

const parsePRNAdherence = (
  response: Response,
  json: any,
): PRNAdherenceEvent => {
  return {
    id: json.id,
    occurredAt: parseDate(response, json, 'occurred_at'),
    userId: json.user_id,
    service: json.service,
    eventType: json.event_type,
    message: json.message,
    signature: json.signature,
    severity: json.severity,
    data: json.data
      ? {
          userId: json.data.userId,
          beaconUUID: json.data.beaconUUID,
          scheduleId: json.data.scheduleId,
          medicamentId: json.data.medicamentId,
          medStatisticId: json.data.medStatisticId,
          scheduleTimeId: json.data.scheduleTimeId,
        }
      : null,
  };
};

export const fetchPRNAdherenceRequest: MedsenseAPIRequestFactory<
  {},
  PRNAdherenceEvent[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/events/dose/taken-as-needed',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parsePRNAdherence);
    },
  };
};

export type InsightRunChartDatum = {
  id: number;
  medicamentId: number;
  userId: number;
  date: string;
  year: number;
  month: number;
  week: number;
  weekDay: string;
  time: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  actualTime: string;
};

const parseInsightRunChartDatum = (_json: any, response: any) => {
  return {
    id: response.id,
    medicamentId: response.medicament_id,
    userId: response.user_id,
    date: response.date,
    year: response.year,
    month: response.month,
    week: response.week,
    weekDay: response.week_day,
    time: response.time,
    status: response.status,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    actualTime: response.actual_time,
  };
};

export const fetchRunChartDataRequest: MedsenseAPIRequestFactory<
  {medicationId: number; startDate: Date; endDate: Date},
  InsightRunChartDatum[]
> = ({variables}) => {
  return {
    createFetchRequest() {
      const queryString = new URLSearchParams({
        start_date: formatDateForServer(variables.startDate),
        end_date: formatDateForServer(variables.endDate),
      });

      return {
        endpoint: `/insights/run-chart/${
          variables.medicationId
        }?${queryString.toString()}`,
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(
        response,
        (json as any).data,
        parseInsightRunChartDatum,
      );
    },
  };
};
