import {Layout, margin} from '@app/appearance/layout';
import {BackButton, BackButtonBuffer} from '@app/components/BackButton';
import {MedsenseText} from '@app/components/Text';
import {getColorForMedication, Medication} from '@app/models/medication';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {IndicatorCircle} from './IndicatorCircle';

type InsightHeaderProps = {
  medication?: Medication;
  onPressBack(): void;
};

export const InsightHeader: React.FC<InsightHeaderProps> = ({
  medication,
  onPressBack,
}) => {
  return (
    <View style={styles.self}>
      <BackButton onPress={onPressBack} />
      <View style={styles.heading}>
        {medication && (
          <IndicatorCircle
            color={getColorForMedication(medication)!}
            style={margin('right', 'p2')}
          />
        )}
        <View>
          <MedsenseText size="h2">{medication?.name ?? 'Overall'}</MedsenseText>
          <MedsenseText size="sm">Adherence</MedsenseText>
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
