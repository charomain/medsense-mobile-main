import {MedsenseTextInput} from '@app/components/TextInput';
import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {
  containerTypeDosageText,
  MedicationViewModel,
  singleDosageText,
} from '../model';
import {DosageTypeModel} from '@app/models/medication';
import {ListToggle} from '@app/components/ListToggle';
import {MedsenseText} from '@app/components/Text';

type MedicationDosageCardProps = {
  medication: MedicationViewModel;
  dosageTypes: DosageTypeModel[];
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Medication Dosage',
  subheading: 'Please enter the dosage for one pill below..',

  dosageQuantityLabel: 'Dosage of one pill',
  dosageQuantityPlaceholder: 'Enter the dosage of one pill...',

  dosageUnitLabel: 'Units for dosage',
  dosageUnitPlaceholder: 'Select medication units...',

  dosageSummary: 'Dosage summary',
};

export const MedicationDosageCard: React.FC<MedicationDosageCardProps> = ({
  onPressBack,
  onPressNext,
  medication,
  dosageTypes,
}) => {
  const [dosageQuantity, setDosageQuantity] = React.useState(
    medication.dosageQuantity,
  );
  const [dosageType, setDosageType] = React.useState(medication.dosageType);
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      dosageType,
      dosageQuantity,
    });
  }, [onPressNext, medication, dosageQuantity, dosageType]);

  const previewText = React.useMemo(() => {
    if (!dosageType || !dosageQuantity) {
      return null;
    }

    const type = containerTypeDosageText(medication.medicationType);

    return `1 ${type} equals ${singleDosageText(dosageType, dosageQuantity)}`;
  }, [dosageType, dosageQuantity, medication]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <MedsenseTextInput
        label={copy.dosageQuantityLabel}
        placeholder={copy.dosageQuantityPlaceholder}
        value={dosageQuantity ?? undefined}
        onChangeText={setDosageQuantity}
        style={standardFormElementSpacing()}
        keyboardType="decimal-pad"
      />
      <ListToggle<DosageTypeModel>
        label={copy.dosageUnitLabel}
        emptyText={copy.dosageUnitPlaceholder}
        selectedValues={dosageType ? [dosageType] : []}
        getKeyForOption={t => t.id}
        getLabelForOption={t => t.name}
        options={dosageTypes}
        onPressOption={setDosageType}
        closeOnSelect={true}
        style={standardFormElementSpacing()}
      />
      {previewText && (
        <MedsenseText style={margin('vertical', 'p2')}>
          {copy.dosageSummary}
        </MedsenseText>
      )}
      <MedsenseText flavor="accent" size="h2" style={margin('bottom', 'p2')}>
        {previewText}
      </MedsenseText>
    </MedicationFormCard>
  );
};
