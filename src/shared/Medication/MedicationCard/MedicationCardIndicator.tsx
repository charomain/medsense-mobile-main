import {Medication} from '@app/models/medication';
import {BeaconCircleIndicator} from '@app/shared/Beacons/BeaconCircleIndicator';
import * as React from 'react';

type MedicationCardIndicatorProps = {
  medication: Medication;
};

export const MedicationCardIndicator: React.FC<
  MedicationCardIndicatorProps
> = ({medication}) => {
  return (
    <BeaconCircleIndicator colorType={medication.colorType ?? undefined} />
  );
};
