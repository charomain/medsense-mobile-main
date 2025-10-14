import {Card} from '@app/components/Card';
import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  getOverallTakePercentageFromAdherenceData,
  AdherenceDataForDate,
  colorForDoseEventType,
  DoseEventType,
} from '@app/models/insights';
import {MedsenseText} from '@app/components/Text';
import {Medication} from '@app/models/medication';
import {InsightPercentCircle} from '@app/shared/Insights/InsightPercentCircle';
import {format} from 'date-fns';
import {Layout, margin, padding} from '@app/appearance/layout';
import {DoseList} from './DoseList';
import {useTheme} from '@app/contexts/theme';

type AdherenceCardProps = {
  adherenceData: AdherenceDataForDate[];
  medication?: Medication;
  startDate: Date;
  endDate: Date;
  style: StyleProp<ViewStyle>;
};

const DATE_FORMAT = 'M/d';

const TakenOrMissedBlock: React.FC<{type: DoseEventType; percent: number}> = ({
  type,
  percent,
}) => {
  return (
    <View style={styles.takenOrMissedRow}>
      <View
        style={[
          styles.takenOrMissedCircle,
          {backgroundColor: colorForDoseEventType(type)},
        ]}
      />
      <MedsenseText size="sm">
        {type === 'taken' ? 'Taken ' : 'Missed '}({Math.round(percent)}%)
      </MedsenseText>
    </View>
  );
};

export const AdherenceCard: React.FC<AdherenceCardProps> = ({
  style,
  adherenceData,
  medication,
  startDate,
  endDate,
}) => {
  const overallTakePercentage = React.useMemo(() => {
    return getOverallTakePercentageFromAdherenceData(adherenceData);
  }, [adherenceData]);

  const theme = useTheme();

  return (
    <Card style={style}>
      <View style={styles.topRow}>
        <View style={[styles.topRowContent, padding('horizontal', 'p1')]}>
          <MedsenseText weight="bold">
            {medication ? `${medication.name} Activity Log` : 'Activity Log'}
          </MedsenseText>
          <MedsenseText style={margin('top', 'p1')} muted={true}>
            {startDate && format(startDate, DATE_FORMAT)} -{' '}
            {endDate && format(endDate, DATE_FORMAT)}
          </MedsenseText>
          <View style={[styles.overallRow, margin('vertical', 'p1')]}>
            <TakenOrMissedBlock percent={overallTakePercentage} type="taken" />
            <TakenOrMissedBlock
              percent={100 - overallTakePercentage}
              type="missed"
            />
          </View>
        </View>
        <InsightPercentCircle
          color={theme.screens.primary.textColor}
          percentage={overallTakePercentage}
          size={70}
        />
      </View>
      <DoseList adherenceData={adherenceData} />
    </Card>
  );
};

const TAKEN_MISSED_CIRCLE_SIZE = 16;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
  },
  overallRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  topRowContent: {
    flex: 1,
  },
  takenOrMissedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.standardSpacing.p1,
  },
  takenOrMissedCircle: {
    width: TAKEN_MISSED_CIRCLE_SIZE,
    height: TAKEN_MISSED_CIRCLE_SIZE,
    borderRadius: TAKEN_MISSED_CIRCLE_SIZE / 2,
    marginRight: Layout.standardSpacing.p1,
  },
});
