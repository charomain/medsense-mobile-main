import {Layout} from '@app/appearance/layout';
import {BackButton, BackButtonBuffer} from '@app/components/BackButton';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {ClinicalProgram} from '../InsightsMainScreen/types';

type InsightHeaderProps = {
  onPressBack(): void;
  program: ClinicalProgram;
};

export const InsightHeader: React.FC<InsightHeaderProps> = ({
  onPressBack,
  program,
}) => {
  return (
    <View style={styles.self}>
      <BackButton onPress={onPressBack} />
      <View style={styles.heading}>
        <View>
          <MedsenseText size="h2">{program.name}</MedsenseText>
        </View>
      </View>
      <BackButtonBuffer />
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Layout.standardSpacing.p3,
  },
});
