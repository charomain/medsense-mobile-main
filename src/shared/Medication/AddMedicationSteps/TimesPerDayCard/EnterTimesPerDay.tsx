import {MedsenseTextInput} from '@app/components/TextInput';
import {standardFormElementSpacing} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';

type EnterTimesPerDayCardProps = {
  initialValue: number | null;
  onPressNext(timesPerDay: number): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Times Per Day',
  subheading:
    'Please enter the number of times per day you take this medication (enter number between 1 and 24).',
  nameLabel: 'Times per day',
  namePlaceholder: 'Enter number of times per day...',
};

export const EnterTimesPerDayCard: React.FC<EnterTimesPerDayCardProps> = ({
  onPressBack,
  onPressNext,
  initialValue,
}) => {
  const [timesPerDay, setTimesPerDay] = React.useState<string>(
    initialValue !== null ? `${initialValue}` : '',
  );
  const numericTimesPerDay = React.useMemo(() => {
    const value = Number(timesPerDay);
    return isNaN(value) ? null : value;
  }, [timesPerDay]);

  const onPressNextWrapped = React.useCallback(() => {
    onPressNext(numericTimesPerDay!);
  }, [onPressNext, numericTimesPerDay]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      onPressNext={onPressNextWrapped}
      disableNextButton={!numericTimesPerDay || numericTimesPerDay < 1}
      onPressBack={onPressBack}>
      <MedsenseTextInput
        label={copy.nameLabel}
        placeholder={copy.namePlaceholder}
        value={timesPerDay}
        onChangeText={setTimesPerDay}
        style={standardFormElementSpacing()}
        keyboardType="decimal-pad"
      />
    </MedicationFormCard>
  );
};
