import {Card} from '@app/components/Card';
import {StatisticResponseModel} from '@app/models/insights';
import * as React from 'react';
import {StyleProp} from 'react-native';
import {InsightChart} from './InsightChart';
import {InsightInterval} from '@app/models/insights';
import {ViewStyle} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {Medication} from '@app/models/medication';
import {margin} from '@app/appearance/layout';
import {format} from 'date-fns';

type InsightChartCardProps = {
  apiPeriods: StatisticResponseModel[];
  medication?: Medication;
  interval: InsightInterval;
  style: StyleProp<ViewStyle>;
  startDate: Date;
  endDate: Date;
};

const DATE_FORMAT_FOR_INTERVAL: Record<InsightInterval, string> = {
  [InsightInterval.daily]: 'M/d',
  [InsightInterval.weekly]: 'M/d',
  [InsightInterval.monthly]: 'M/d',
};

const DATE_FORMAT = 'M/d';

export const InsightChartCard: React.FC<InsightChartCardProps> = ({
  apiPeriods,
  interval,
  style,
  medication,
  startDate,
  endDate,
}) => {
  const chartData = React.useMemo(() => {
    return apiPeriods
      .map(p => {
        return {
          date: p.startDate!,
          percent: p.percent,
          // percent: Math.random(),
        };
      })
      .reverse();
  }, [apiPeriods]);

  return (
    <Card style={style}>
      <MedsenseText style={margin('bottom', 'p1')} weight="bold">
        {medication?.name ?? 'Overall'} Adherence
      </MedsenseText>
      <MedsenseText style={margin('bottom', 'p2')} muted={true}>
        {startDate && format(startDate, DATE_FORMAT)} -{' '}
        {endDate && format(endDate, DATE_FORMAT)}
      </MedsenseText>
      <InsightChart
        data={chartData}
        dateFormat={DATE_FORMAT_FOR_INTERVAL[interval]}
      />
    </Card>
  );
};
