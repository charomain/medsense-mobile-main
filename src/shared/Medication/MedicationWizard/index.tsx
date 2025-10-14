import {Layout} from '@app/appearance/layout';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {
  isMedicationPRN,
  MedicationViewModel,
  PILL_ORGANIZER_ID,
  WizardSteps,
} from '@app/shared/Medication/model';
import {MedicationSummary} from './MedicationSummary';
import {MedicationWizardContent} from './MedicationWizardContent';
import {
  DosageTypeModel,
  MedicationContainer,
  MedicationTypeModel,
} from '@app/models/medication';
import {FreeBeaconModel} from '@app/models/beacon';
import {NormalizedBeaconSet} from '@app/models/beacon';

type MedicationWizardProps = {
  medication: MedicationViewModel;
  medicationTypes: MedicationTypeModel[];
  dosageTypes: DosageTypeModel[];
  containerTypes: MedicationContainer[];
  freeBeacons: FreeBeaconModel[];
  beaconSets: NormalizedBeaconSet[];
  onPressScanMore(): void;
  startOnSummary: boolean;
  onPressDelete: (() => void) | null;
  onSave(medication: MedicationViewModel, isEditing: boolean): void;
  onPressBack(): void;
  skipContainerSelection: boolean;
  isEditing: boolean;
};

export const MedicationWizard: React.FC<MedicationWizardProps> = ({
  medicationTypes,
  dosageTypes,
  containerTypes,
  medication: initialMedication,
  startOnSummary,
  freeBeacons,
  onPressDelete,
  onPressBack,
  onSave,
  onPressScanMore,
  beaconSets,
  skipContainerSelection,
  isEditing,
}) => {
  const [medication, setMedication] =
    React.useState<MedicationViewModel>(initialMedication);
  const isOrganizer = React.useMemo(() => {
    return PILL_ORGANIZER_ID === medication.container?.id!;
  }, [medication]);

  const isPRN = React.useMemo(() => {
    return isMedicationPRN(medication);
  }, [medication]);

  const steps: WizardSteps[] = React.useMemo(() => {
    return (
      [
        'container',
        'beacon',
        'name',
        'photo',
        'type',
        'schedule',
        'reminders',
        'dosage',
        'timesPerDay',
      ] as WizardSteps[]
    ).filter((step: WizardSteps) => {
      if (isOrganizer && step === 'beacon') {
        return false;
      }

      if (skipContainerSelection && step === 'container') {
        return false;
      }

      if (isPRN && (step === 'timesPerDay' || step === 'reminders')) {
        return false;
      }

      return true;
    });
  }, [isOrganizer, isPRN, skipContainerSelection]);

  const [stepIndex, setStepIndex] = React.useState(
    startOnSummary ? steps.length : 0,
  );
  const [isEditingPreviousStep, setIsEditingPreviousStep] =
    React.useState(false);
  const onUpdate = React.useCallback(
    (newMedication: MedicationViewModel) => {
      setMedication(newMedication);
      const currentStep = steps[stepIndex];
      if (
        isEditingPreviousStep &&
        !['schedule', 'dosage'].includes(currentStep)
      ) {
        setStepIndex(steps.length);
      } else {
        setStepIndex(stepIndex + 1);
      }
    },
    [stepIndex, steps, setStepIndex, setMedication, isEditingPreviousStep],
  );

  const onPressBackWrapped = React.useCallback(() => {
    if (stepIndex === 0) {
      onPressBack();
      return;
    }

    setStepIndex(stepIndex > 1 ? stepIndex - 1 : 0);
  }, [stepIndex, setStepIndex, onPressBack]);

  const isFinished = stepIndex === steps.length;

  const onPressGoBackToStep = React.useCallback(
    (step: WizardSteps) => {
      const newStepIndex = steps.findIndex(s => s === step);
      setStepIndex(newStepIndex);
      setIsEditingPreviousStep(true);
    },
    [steps, setIsEditingPreviousStep, setStepIndex],
  );

  const onPressSave = React.useCallback(() => {
    onSave(medication, isEditing);
  }, [onSave, medication, isEditing]);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {isFinished ? (
        <MedicationSummary
          goBackToStep={onPressGoBackToStep}
          medication={medication}
          onPressSave={onPressSave}
          onPressDelete={onPressDelete}
        />
      ) : (
        <MedicationWizardContent
          medication={medication}
          onUpdate={onUpdate}
          steps={steps}
          stepIndex={stepIndex}
          onPressBack={onPressBackWrapped}
          medicationTypes={medicationTypes}
          dosageTypes={dosageTypes}
          containerTypes={containerTypes}
          freeBeacons={freeBeacons}
          beaconSets={beaconSets}
          onPressScanMore={onPressScanMore}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: Layout.standardSpacing.p2,
  },
});
