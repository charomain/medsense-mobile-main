import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useInsightsAPI} from './hooks';
import {InsightsStackScreenProps} from '../types';
import {InsightChartCard} from './InsightChartCard';
import {AdherenceCard} from './AdherenceCard';
import {Layout, margin} from '@app/appearance/layout';
import {InsightsDateTimeSelector} from '@app/shared/Insights/InsightsDateTimeSelector';
import {InsightInterval} from '@app/models/insights';
import {InsightHeader} from './InsightHeader';
import {ListToggle} from '@app/components/ListToggle';
import {INSIGHT_GRAPH_TYPES_LABELS, InsightGraphType} from './types';
import {InsightRunChartCard} from './InsightRunChartCard';

type InsightsDetailScreenProps = InsightsStackScreenProps<'InsightsDetail'>;

export const InsightsDetailScreen: React.FC<InsightsDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {interval, medication, startDate, endDate} = route.params;
  const {
    adherenceData,
    selectAPIPeriod,
    apiPeriods,
    currentAPIPeriod,
    fetchPeriods,
    loading,
    runChartData,
  } = useInsightsAPI(medication?.id);

  const [graphType, setGraphType] = React.useState<InsightGraphType>('run');

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

  return (
    <MedsenseScreen showLoadingOverlay={loading}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <InsightHeader
          onPressBack={navigation.goBack}
          medication={medication}
        />
        {apiPeriods && (
          <>
            <InsightsDateTimeSelector
              interval={interval}
              onChangeInterval={onChangeInterval}
              apiPeriod={currentAPIPeriod}
              apiPeriods={apiPeriods}
              onChangeAPIPeriod={selectAPIPeriod}
            />
            <ListToggle<InsightGraphType>
              label="Graph Type"
              selectedValues={graphType}
              onPressOption={setGraphType}
              options={['adherence', 'run']}
              getLabelForOption={d => INSIGHT_GRAPH_TYPES_LABELS[d]}
              getKeyForOption={d => d}
              closeOnSelect={true}
              style={margin('bottom', 'p2')}
            />
            {graphType === 'adherence' && (
              <InsightChartCard
                style={margin('bottom', 'p3')}
                apiPeriods={apiPeriods}
                interval={interval}
                medication={medication}
                startDate={currentAPIPeriod?.startDate ?? startDate}
                endDate={currentAPIPeriod?.endDate ?? endDate}
              />
            )}
            {graphType === 'run' && runChartData && (
              <InsightRunChartCard
                style={margin('bottom', 'p3')}
                medication={medication!}
                data={runChartData}
                startDate={currentAPIPeriod?.startDate ?? startDate}
                endDate={currentAPIPeriod?.endDate ?? endDate}
              />
            )}
          </>
        )}
        {adherenceData && (
          <AdherenceCard
            style={margin('bottom', 'p3')}
            medication={medication}
            startDate={currentAPIPeriod?.startDate ?? startDate}
            endDate={currentAPIPeriod?.endDate ?? endDate}
            adherenceData={adherenceData}
          />
        )}
      </ScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: Layout.standardSpacing.p2,
  },
});
