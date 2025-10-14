import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {margin} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {useProgramsAPI} from './hooks';
import {ProgramRow} from './ProgramRow';

type ProgramsScreenProps = {};

const copy = {
  heading: 'Programs',
  subtitle: 'Medsense Clinical Programs',
  yourPrograms: 'Programs',
  actions: {
    createNewAccount: 'Add Someone You Care For',
    giveAnotherUserAccess: 'Give Another User Access To Your Account',
  },
};

export const ProgramsScreen: React.FC<ProgramsScreenProps> = ({}) => {
  const {loading, data, onPressEnroll} = useProgramsAPI();

  return (
    <MedsenseScreen includeSpacing={true} showLoadingOverlay={loading}>
      <ScreenLogoHeader />
      <ScreenTextHeading title={copy.heading} subtitle={copy.subtitle} />
      <ScrollView>
        <MedsenseText
          style={margin('bottom', 'p3')}
          weight="bold"
          align="center">
          {copy.yourPrograms}
        </MedsenseText>
        <View style={styles.content}>
          {data.map(program => (
            <ProgramRow
              onPressEnroll={onPressEnroll}
              item={program}
              style={margin('bottom', 'p2')}
            />
          ))}
        </View>
      </ScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {},
});
