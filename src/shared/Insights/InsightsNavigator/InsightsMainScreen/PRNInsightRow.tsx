import * as React from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {MedicationCard} from '@app/shared/Medication/MedicationCard';
import {View} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {Colors} from '@app/appearance/colors';
import {Layout} from '@app/appearance/layout';
import {isMedicationColorLight, Medication} from '@app/models/medication';
import {PRNAdherenceDatum} from '@app/models/insights';
import {PRNCircle} from './PRNCircle';

type PRNInsightRowProps = {
  model: PRNAdherenceDatum[];
  style: StyleProp<ViewStyle>;
  onPress(medication: Medication, model: PRNAdherenceDatum[]): void;
};

const copy = {
  adherence: 'Adherence',
};

export const PRNInsightRow: React.FC<PRNInsightRowProps> = ({
  model,
  style,
  onPress,
}) => {
  const first = model[0];
  const medication = first?.medication;

  const onPressWrapped = React.useCallback(() => {
    if (medication) {
      onPress(medication, model);
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
        <PRNCircle
          events={model.length}
          size={25}
          color={isLight ? Colors.dark : Colors.light}
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
