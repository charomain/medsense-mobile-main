import {MedsenseTextInput} from '@app/components/TextInput';
import {standardFormElementSpacing} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationViewModel} from '../model';

type MedicationNameCardProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Medication Name',
  subheading: 'Please enter the medication name below.',
  nameLabel: 'Medication name',
  namePlaceholder: 'Enter the medication name here...',
};

export const MedicationNameCard: React.FC<MedicationNameCardProps> = ({
  onPressBack,
  onPressNext,
  medication,
}) => {
  const [name, setName] = React.useState(medication.name);
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      name,
    });
  }, [onPressNext, name, medication]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={!name}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <MedsenseTextInput
        label={copy.nameLabel}
        placeholder={copy.namePlaceholder}
        value={name}
        onChangeText={setName}
        style={standardFormElementSpacing()}
      />
    </MedicationFormCard>
  );
};
