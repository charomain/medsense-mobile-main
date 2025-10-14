import {AddMedicationStackScreenProps} from '../types';
import {AddMedicationQR} from '@app/shared/Medication/AddMedicationQR';
import * as React from 'react';

type AddMedicationQRScreenProps = AddMedicationStackScreenProps<'QRScan'>;

export const AddMedicationQRScreen: React.FC<AddMedicationQRScreenProps> = ({
  navigation,
}) => {
  return (
    <AddMedicationQR
      onSuccessfulScan={() => navigation.replace('AddMedication')}
      onPressManualEntry={() => navigation.replace('ManualEntry')}
    />
  );
};
