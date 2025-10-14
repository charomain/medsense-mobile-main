import {standardFormElementSpacing} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import {MedicationTypeModel} from '@app/models/medication';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationViewModel} from '../model';

type MedicationTypeCardProps = {
  medication: MedicationViewModel;
  medicationTypes: MedicationTypeModel[];
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Medication Type',
  subheading: 'Please enter the medication type below.',
  typeLabel: 'Medication type',
  typeEmptyText: 'Select the medication type...',
};

export const MedicationTypeCard: React.FC<MedicationTypeCardProps> = ({
  onPressBack,
  onPressNext,
  medication,
  medicationTypes,
}) => {
  const [medicationType, setMedicationType] = React.useState(
    medication.medicationType,
  );
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      medicationType,
    });
  }, [onPressNext, medicationType, medication]);

  const isNextButtonDisabled = !medicationType;

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={isNextButtonDisabled}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <ListToggle<MedicationTypeModel>
        label={copy.typeLabel}
        emptyText={copy.typeEmptyText}
        selectedValues={medicationType ? [medicationType] : []}
        getKeyForOption={t => t.id}
        getLabelForOption={t => t.name}
        options={medicationTypes}
        onPressOption={setMedicationType}
        closeOnSelect={true}
        style={standardFormElementSpacing()}
      />
    </MedicationFormCard>
  );
};

// const styles = StyleSheet.create({});
