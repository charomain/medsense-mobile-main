import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {TIME_FORMAT} from '@app/models/date';
import {format} from 'date-fns';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgramSurveryDatum} from './types';

type ActivityLogProps = {
  data: ProgramSurveryDatum[];
};

export const DATE_FORMAT = 'M/d';

export const ActivityLog: React.FC<ActivityLogProps> = ({data}) => {
  const theme = useTheme();

  return (
    <>
      {data.map(row => (
        <View style={[styles.row, {borderTopColor: theme.borderColor}]}>
          <View
            style={[styles.scoreCircle, {backgroundColor: theme.accentColor}]}>
            <MedsenseText style={styles.scoreText}>{row.score}</MedsenseText>
          </View>
          <View style={styles.info}>
            <MedsenseText weight="bold">Pain Score</MedsenseText>
            <MedsenseText flavor="muted" size="sm" style={margin('top', 'p05')}>
              {row.score} out of {row.max}
            </MedsenseText>
          </View>
          <View style={styles.time}>
            <MedsenseText muted={true}>
              Indicated pain was dull ({row.score}) on program survey (
              {format(row.date, TIME_FORMAT)} on {format(row.date, DATE_FORMAT)}
              )
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
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  time: {
    flex: 2,
    marginLeft: Layout.standardSpacing.p05,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  scoreText: {
    color: '#fff',
  },
});
