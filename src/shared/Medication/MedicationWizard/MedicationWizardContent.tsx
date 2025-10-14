import * as React from 'react';
import {MedicationNameCard} from '@app/shared/Medication/AddMedicationSteps/MedicationNameCard';
import {MedicationTypeCard} from '@app/shared/Medication/AddMedicationSteps/MedicationTypeCard';
import {MedicationRemindersCard} from '@app/shared/Medication/AddMedicationSteps/MedicationRemindersCard';
import {MedicationDosageCard} from '@app/shared/Medication/AddMedicationSteps/MedicationDosageCard';
import {MedicationPhotoCard} from '@app/shared/Medication/AddMedicationSteps/MedicationPhotoCard';
import {MedicationContainerSelection} from '@app/shared/Medication/AddMedicationSteps/MedicationContainerSelection';
import {TimesPerDayCard} from '@app/shared/Medication/AddMedicationSteps/TimesPerDayCard/index';
import {MedicationScheduleFrequencySelectionCard} from '@app/shared/Medication/AddMedicationSteps/MedicationScheduleFrequencySelectionCard';
import {MedicationViewModel, WizardSteps} from '../model';
import {
  DosageTypeModel,
  MedicationContainer,
  MedicationTypeModel,
} from '@app/models/medication';
import {MedicationBeaconSelection} from '@app/shared/Medication/AddMedicationSteps/MedicationBeaconSelection';
import {FreeBeaconModel, NormalizedBeaconSet} from '@app/models/beacon';

type AddMedicationWizardContentProps = {
  medication: MedicationViewModel;
  steps: WizardSteps[];
  stepIndex: number;
  medicationTypes: MedicationTypeModel[];
  dosageTypes: DosageTypeModel[];
  containerTypes: MedicationContainer[];
  onUpdate(newMedication: MedicationViewModel): void;
  freeBeacons: FreeBeaconModel[];
  beaconSets: NormalizedBeaconSet[];
  onPressBack(): void;
  onPressScanMore(): void;
};

export const MedicationWizardContent: React.FC<
  AddMedicationWizardContentProps
> = ({
  onPressBack,
  medication,
  onUpdate,
  steps,
  stepIndex,
  medicationTypes,
  dosageTypes,
  containerTypes,
  freeBeacons,
  beaconSets,
  onPressScanMore,
}) => {
  const step = steps[stepIndex];

  switch (step) {
    case 'container':
      return (
        <MedicationContainerSelection
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
          containerTypes={containerTypes}
          onPressScanMore={onPressScanMore}
          beaconSets={beaconSets}
        />
      );
    case 'name':
      return (
        <MedicationNameCard
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
        />
      );
    case 'type':
      return (
        <MedicationTypeCard
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
          medicationTypes={medicationTypes}
        />
      );
    case 'reminders':
      return (
        <MedicationRemindersCard
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
        />
      );
    case 'schedule':
      return (
        <MedicationScheduleFrequencySelectionCard
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
        />
      );
    case 'dosage':
      return (
        <MedicationDosageCard
          onPressBack={onPressBack}
          medication={medication}
          onPressNext={onUpdate}
          dosageTypes={dosageTypes}
        />
      );
    case 'timesPerDay':
      return (
        <TimesPerDayCard
          medication={medication}
          onPressBack={onPressBack}
          onPressNext={onUpdate}
        />
      );
    case 'beacon':
      return (
        <MedicationBeaconSelection
          medication={medication}
          onPressBack={onPressBack}
          onPressNext={onUpdate}
          freeBeacons={freeBeacons}
        />
      );
    case 'photo':
      return (
        <MedicationPhotoCard
          medication={medication}
          onPressBack={onPressBack}
          onPressNext={onUpdate}
        />
      );
  }
};
