import {Card} from '@app/components/Card';
import * as React from 'react';
import {StyleProp, StyleSheet, View} from 'react-native';
import {InsightChart} from './InsightChart';
import {InsightInterval} from '@app/models/insights';
import {ViewStyle} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {margin} from '@app/appearance/layout';
import {ProgramSurveryDatum} from './types';
import {DateRow} from './DateRow';
import {TrendBoxWithDetail} from './TrendBoxWithDetail';

type InsightChartCardProps = {
  points: ProgramSurveryDatum[];
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

export const InsightChartCard: React.FC<InsightChartCardProps> = ({
  points,
  interval,
  style,
  startDate,
  endDate,
}) => {
  return (
    <Card style={style}>
      <View style={styles.row}>
        <MedsenseText style={margin('bottom', 'p1')} weight="bold">
          Pain Score
        </MedsenseText>
        <TrendBoxWithDetail direction="positive" text="+10%" />
      </View>
      <DateRow startDate={startDate} endDate={endDate} />
      <InsightChart
        data={points}
        dateFormat={DATE_FORMAT_FOR_INTERVAL[interval]}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
