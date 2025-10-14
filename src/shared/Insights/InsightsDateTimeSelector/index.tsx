import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import {InsightInterval, StatisticResponseModel} from '@app/models/insights';
import {format, isSameDay} from 'date-fns';

export type IntervalOption = {
  id: InsightInterval;
  label: string;
};

const INTERVAL_OPTIONS: IntervalOption[] = [
  {
    id: InsightInterval.daily,
    label: 'By Day',
  },
  {
    id: InsightInterval.weekly,
    label: 'By Week',
  },
  {
    id: InsightInterval.monthly,
    label: 'By Month',
  },
];

const getLabelForOption = (i: IntervalOption) => i.label;
const getIdForOption = (i: IntervalOption) => i.id;

type InsightsDateTimeSelectorProps = {
  interval: InsightInterval;
  onChangeInterval(interval: InsightInterval): void;

  apiPeriod: StatisticResponseModel | undefined;
  apiPeriods: StatisticResponseModel[];
  onChangeAPIPeriod(model: StatisticResponseModel): void;
};

const areStatisticResponseModelEqual = (
  m1: StatisticResponseModel,
  m2: StatisticResponseModel,
): boolean => {
  return (
    m1.startDate?.getTime() === m2.startDate?.getTime() ||
    m1.endDate?.getTime() === m2.endDate?.getTime()
  );
};

const getLabelForPeriod = (period: StatisticResponseModel) => {
  if (isSameDay(period.startDate!, period.endDate!)) {
    return format(period.startDate!, 'MM/dd/uuuu');
  }

  return `${format(period.startDate!, 'MM/dd/uuuu')} - ${format(
    period.endDate!,
    'MM/dd/uuuu',
  )}`;
};

export const InsightsDateTimeSelector: React.FC<
  InsightsDateTimeSelectorProps
> = ({
  interval,
  onChangeInterval,
  apiPeriods,
  apiPeriod,
  onChangeAPIPeriod,
}) => {
  const setInterval = React.useCallback(
    (i: IntervalOption) => {
      onChangeInterval(i.id);
    },
    [onChangeInterval],
  );

  const intervalOption = React.useMemo(() => {
    return INTERVAL_OPTIONS.find(o => interval === o.id) ?? INTERVAL_OPTIONS[0];
  }, [interval]);

  return (
    <>
      <ListToggle<IntervalOption>
        label="Time Range"
        selectedValues={intervalOption}
        onPressOption={setInterval}
        options={INTERVAL_OPTIONS}
        getLabelForOption={getLabelForOption}
        getKeyForOption={getIdForOption}
        closeOnSelect={true}
        style={[margin('top', 'p3'), margin('bottom', 'p2')]}
      />
      <ListToggle<StatisticResponseModel>
        label="Dates"
        selectedValues={apiPeriod ?? null}
        onPressOption={onChangeAPIPeriod}
        options={apiPeriods}
        areValuesEqual={areStatisticResponseModelEqual}
        getLabelForOption={getLabelForPeriod}
        getKeyForOption={p => p.startDate!.toString()}
        closeOnSelect={true}
        style={margin('bottom', 'p2')}
      />
    </>
  );
};
