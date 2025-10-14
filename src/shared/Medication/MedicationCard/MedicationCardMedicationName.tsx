import {Colors} from '@app/appearance/colors';
import {MedsenseText} from '@app/components/Text';
import {Medication, isMedicationColorLight} from '@app/models/medication';
import * as React from 'react';
import {StyleSheet} from 'react-native';

type MedicationCardMedicationNameProps = {
  medication: Medication;
};

export const MedicationCardMedicationName: React.FC<
  MedicationCardMedicationNameProps
> = ({medication}) => {
  const isLight = isMedicationColorLight(medication);

  return (
    <MedsenseText
      size="h2"
      style={[isLight ? styles.lightNameText : styles.nameText]}>
      {medication.name}
    </MedsenseText>
  );
};

const styles = StyleSheet.create({
  nameText: {
    color: Colors.white,
  },
  lightNameText: {
    color: Colors.dark,
  },
});
