import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {TIME_FORMAT} from '@app/models/date';
import {colorForDoseEventType, PRNAdherenceDatum} from '@app/models/insights';
import {format} from 'date-fns';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type DoseListProps = {
  data: PRNAdherenceDatum[];
};

export const DATE_FORMAT = 'M/d';

export const DoseList: React.FC<DoseListProps> = ({data}) => {
  const theme = useTheme();

  return (
    <>
      {data.map(row => (
        <View style={[styles.row, {borderTopColor: theme.borderColor}]}>
          <View style={styles.info}>
            <MedsenseText
              weight="bold"
              style={{color: colorForDoseEventType('taken')}}>
              {'Taken'}
            </MedsenseText>
          </View>
          <View style={styles.time}>
            <MedsenseText muted={true}>
              {format(row.occurredAt, TIME_FORMAT)} on{' '}
              {format(row.occurredAt, DATE_FORMAT)}
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
    flex: 1,
  },
  time: {
    marginLeft: Layout.standardSpacing.p05,
  },
});
