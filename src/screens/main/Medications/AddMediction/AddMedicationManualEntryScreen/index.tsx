import {AddMedicationManualEntry} from '@app/shared/Medication/AddMedicationManualEntry';
import * as React from 'react';
import {AddMedicationStackScreenProps} from '../types';
type AddMedicationManualEntryScreenProps =
  AddMedicationStackScreenProps<'ManualEntry'>;

export const AddMedicationManualEntryScreen: React.FC<
  AddMedicationManualEntryScreenProps
> = ({navigation}) => {
  const onPressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AddMedicationManualEntry
      onFinishAdd={() => navigation.replace('AddMedication')}
      onPressBack={onPressBack}
    />
  );
};
