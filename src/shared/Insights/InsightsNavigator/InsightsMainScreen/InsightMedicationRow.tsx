import * as React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {MedicationCard} from '@app/shared/Medication/MedicationCard';
import {InsightMedicationViewModel} from './hooks';
import {View} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {Colors} from '@app/appearance/colors';
import {Layout} from '@app/appearance/layout';
import {InsightPercentCircle} from '@app/shared/Insights/InsightPercentCircle';
import {isMedicationColorLight} from '@app/models/medication';

type InsightMedicationRowProps = {
  model: InsightMedicationViewModel;
  style: StyleProp<ViewStyle>;
  onPress(model: InsightMedicationViewModel): void;
};

const copy = {
  adherence: 'Adherence',
};

export const InsightMedicationRow: React.FC<InsightMedicationRowProps> = ({
  model,
  style,
  onPress,
}) => {
  const {medication} = model;
  const onPressWrapped = React.useCallback(() => {
    if (medication) {
      onPress(model);
    }
  }, [model, onPress, medication]);

  if (!medication) {
    return null;
  }

  const isLight = isMedicationColorLight(medication);

  return (
    <MedicationCard
      onPress={onPressWrapped}
      style={style}
      medication={medication}>
      <View style={styles.row}>
        <MedicationCard.Indicator medication={medication} />
        <View style={styles.infoText}>
          <MedicationCard.Name medication={medication} />
          <MedsenseText style={!isLight && styles.white}>
            {copy.adherence}
          </MedsenseText>
        </View>
        <InsightPercentCircle
          color={isLight ? Colors.dark : Colors.light}
          size={75}
          percentage={model.percent * 100}
        />
      </View>
    </MedicationCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: Layout.standardSpacing.p1,
  },
  white: {
    color: Colors.white,
  },
});
