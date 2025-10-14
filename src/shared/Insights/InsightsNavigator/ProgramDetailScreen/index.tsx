import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {InsightsStackScreenProps} from '../types';
import {Layout, margin} from '@app/appearance/layout';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ActivityLog} from './ActivityLog';
import {InsightHeader} from './InsightHeader';
import {useInsightsAPI} from '../InsightsDetailScreen/hooks';
import {InsightsDateTimeSelector} from '../../InsightsDateTimeSelector';
import {InsightInterval} from '@app/models/insights';
import {InsightChartCard} from './InsightChartCard';
import {DateRow} from './DateRow';
import {TrendBoxWithDetail} from './TrendBoxWithDetail';

type ProgramDetailScreenProps = InsightsStackScreenProps<'ProgramDetailScreen'>;
const events = [
  {
    date: new Date(),
    score: 4,
    max: 10,
    painText: 'Indicated pain was dull (4) on program survey (11:00pm 8/4/23)',
  },
];

export const ProgramDetailScreen: React.FC<ProgramDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {interval, program, startDate, endDate} = route.params;
  const {selectAPIPeriod, apiPeriods, currentAPIPeriod, fetchPeriods, loading} =
    useInsightsAPI();

  React.useEffect(() => {
    fetchPeriods(interval, 8, startDate);
  }, [fetchPeriods, route, interval, startDate]);

  const onChangeInterval = React.useCallback(
    (newInterval: InsightInterval) => {
      navigation.setParams({
        interval: newInterval,
      });
    },
    [navigation],
  );

  const averagePainScore = React.useMemo(() => {
    return events.reduce((total, row) => total + row.score, 0) / events.length;
  }, []);

  return (
    <MedsenseScreen showLoadingOverlay={loading}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <InsightHeader onPressBack={navigation.goBack} program={program} />
        {apiPeriods && (
          <>
            <InsightsDateTimeSelector
              interval={interval}
              onChangeInterval={onChangeInterval}
              apiPeriod={currentAPIPeriod}
              apiPeriods={apiPeriods}
              onChangeAPIPeriod={selectAPIPeriod}
            />
            <InsightChartCard
              style={margin('bottom', 'p3')}
              points={events}
              interval={interval}
              startDate={currentAPIPeriod?.startDate ?? startDate}
              endDate={currentAPIPeriod?.endDate ?? endDate}
            />
          </>
        )}
        <Card style={margin('bottom', 'p3')}>
          <View style={styles.cardTitle}>
            <MedsenseText style={margin('bottom', 'p2')}>
              Pain Score Activity Log
            </MedsenseText>
            <TrendBoxWithDetail direction="positive" text="+10%" />
          </View>
          <DateRow startDate={startDate} endDate={endDate} />
          <MedsenseText style={margin('bottom', 'p2')}>
            Average {averagePainScore} out of 10 on {events.length} survey(s)
          </MedsenseText>
          <ActivityLog data={events} />
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: Layout.standardSpacing.p2,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
