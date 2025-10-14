import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {InsightsStackScreenProps} from '../types';
import {Layout, margin} from '@app/appearance/layout';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {DoseList} from './DoseList';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';

type PRNInsightDetailScreenProps =
  InsightsStackScreenProps<'PRNInsightDetailScreen'>;

export const PRNInsightDetailScreen: React.FC<PRNInsightDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {events, medication} = route.params;

  return (
    <MedsenseScreen>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ScreenLogoHeader />
        <ScreenTextHeading
          title={medication.name}
          subtitle={null}
          onPressBack={() => navigation.goBack()}
        />
        <Card style={margin('bottom', 'p3')}>
          <MedsenseText style={margin('bottom', 'p2')}>
            Activity Log
          </MedsenseText>
          <DoseList data={events} />
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: Layout.standardSpacing.p2,
  },
});
