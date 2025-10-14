import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {TIME_FORMAT} from '@app/models/date';
import {
  AdherenceDataForDate,
  AdherenceMedication,
  DoseEventType,
  colorForDoseEventType,
} from '@app/models/insights';
import {getColorFromColorType} from '@app/models/medication';
import {format} from 'date-fns';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {IndicatorCircle} from './IndicatorCircle';

type DoseListProps = {
  adherenceData: AdherenceDataForDate[];
};

type TaggedAdherenceEvent = AdherenceMedication & {type: DoseEventType};

const tagEventFactory = (eventType: DoseEventType) => {
  return (event: AdherenceMedication): TaggedAdherenceEvent => {
    return {
      ...event,
      type: eventType,
    };
  };
};

export const DATE_FORMAT = 'M/d';

export const DoseList: React.FC<DoseListProps> = ({adherenceData}) => {
  const theme = useTheme();
  const events = React.useMemo(() => {
    const taggedMissedData = adherenceData.reduce((accum, data) => {
      return accum.concat(data.missedData.map(tagEventFactory('missed')));
    }, [] as TaggedAdherenceEvent[]);

    const taggedTakenData = adherenceData.reduce((accum, data) => {
      return accum.concat(data.takenData.map(tagEventFactory('taken')));
    }, [] as TaggedAdherenceEvent[]);

    return taggedMissedData.concat(taggedTakenData).sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
  }, [adherenceData]);

  return (
    <>
      {events.map(event => (
        <View style={[styles.row, {borderTopColor: theme.borderColor}]}>
          {event.color && (
            <IndicatorCircle
              doseEventType={event.type}
              style={margin('right', 'p1')}
              color={getColorFromColorType(event.color)}
            />
          )}
          <View style={styles.info}>
            <MedsenseText weight="bold">{event.name}</MedsenseText>
            <MedsenseText
              weight="bold"
              style={{color: colorForDoseEventType(event.type)}}>
              {event.type === 'missed' ? 'Missed' : 'Taken'}
            </MedsenseText>
          </View>
          <View style={styles.time}>
            <MedsenseText muted={true}>
              {format(event.actualTime, TIME_FORMAT)} on{' '}
              {format(event.date, DATE_FORMAT)} (planned{' '}
              {format(event.time, TIME_FORMAT)})
            </MedsenseText>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    borderTopWidth: 1,
    paddingVertical: Layout.standardSpacing.p2,
    paddingHorizontal: Layout.standardSpacing.p1,
    flexDirection: 'row',
  },
  info: {
    flex: 4,
  },
  time: {
    flex: 6,
    marginLeft: Layout.standardSpacing.p05,
  },
});
