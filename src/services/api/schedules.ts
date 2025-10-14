import {MedsenseAPIRequestFactory} from '../types';
import {WeekDay} from '@app/models/medication';
import {formatTimeForServer} from './utils';

type SchedulePeriodDto = {periodRange: number};
type ScheduleWeekDayDto = {weekDay: WeekDay};

export type ScheduleDTO = SchedulePeriodDto | ScheduleWeekDayDto;

type BatchSaveSchedulesRequest = {
  medicationId: number;
  schedules: ScheduleDTO[];
};

const isWeekDaySchedule = (x: ScheduleDTO): x is ScheduleWeekDayDto => {
  return (x as ScheduleWeekDayDto).weekDay !== undefined;
};

export const batchSaveSchedulesRequest: MedsenseAPIRequestFactory<
  BatchSaveSchedulesRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/schedules/${variables.medicationId}/bunch`,
        method: 'POST',
        sendBodyAs: 'json',
        body: variables.schedules.map(schedule => {
          if (isWeekDaySchedule(schedule)) {
            return {
              week_day: schedule.weekDay,
            };
          } else {
            return {
              period_range: schedule.periodRange,
            };
          }
        }),
      };
    },
    parseResponse() {},
  };
};

type BatchSaveTimeDTO = {
  time: Date;
  quantity: number;
};

type BatchSaveScheduleTimesRequest = {
  medicationId: number;
  times: BatchSaveTimeDTO[];
};

export const batchSaveScheduleTimesRequest: MedsenseAPIRequestFactory<
  BatchSaveScheduleTimesRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/schedule-times/${variables.medicationId}/bunch`,
        method: 'POST',
        sendBodyAs: 'json',
        body: variables.times.map(time => {
          return {
            time: formatTimeForServer(time.time),
            quantity: time.quantity,
          };
        }),
      };
    },
    parseResponse() {},
  };
};
