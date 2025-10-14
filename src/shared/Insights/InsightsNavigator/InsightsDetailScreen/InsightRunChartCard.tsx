import {Medication} from '@app/models/medication';
import {InsightRunChartDatum} from '@app/services/api/insights';
import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {RunChartGraph} from './RunChartGraph';

type InsightRunChartCardProps = {
  data: InsightRunChartDatum[];
  style: StyleProp<ViewStyle>;
  startDate: Date;
  endDate: Date;
  medication: Medication;
};

export const InsightRunChartCard: React.FC<InsightRunChartCardProps> = ({
  data,
}) => {
  return <RunChartGraph maxYLabel={7} data={data} dateFormat="M/d" />;
};
