import {standardFormElementSpacing} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationViewModel, isScheduleFrequencyIntervalValid} from '../model';
import {WeekDaySelector} from './Scheduling/WeekDaySelector';
import {
  SCHEDULE_FREQUENCY_INTERVAL_LABELS,
  ScheduleFrequencyIntervalType,
} from '@app/models/medication';
import {RecurringFrequencySelector} from './Scheduling/RecurringFrequencySelector';

type MedicationScheduleFrequencySelectionCardProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Medication Schedule',
  subheading: 'Please configure the schedule for when to take this medication.',
  typeLabel: 'Schedule',
  typeEmptyText: 'Select when you take medication...',
};

const OPTIONS: ScheduleFrequencyIntervalType[] = [
  'daily',
  'specific-days',
  'recurring-interval',
  'as-needed',
];

export const MedicationScheduleFrequencySelectionCard: React.FC<
  MedicationScheduleFrequencySelectionCardProps
> = ({onPressBack, onPressNext, medication}) => {
  const [scheduleFrequencyInterval, setScheduleFrequencyInterval] =
    React.useState(medication.scheduleFrequencyInterval);
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      scheduleFrequencyInterval,
    });
  }, [onPressNext, scheduleFrequencyInterval, medication]);

  const onSelectType = React.useCallback(
    (type: ScheduleFrequencyIntervalType) => {
      setScheduleFrequencyInterval({
        type,
      });
    },
    [setScheduleFrequencyInterval],
  );

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      onPressNext={onPressNextWrapped}
      disableNextButton={
        !scheduleFrequencyInterval ||
        !isScheduleFrequencyIntervalValid(scheduleFrequencyInterval)
      }
      onPressBack={onPressBack}>
      <ListToggle<ScheduleFrequencyIntervalType>
        label={copy.typeLabel}
        emptyText={copy.typeEmptyText}
        selectedValues={
          scheduleFrequencyInterval?.type
            ? [scheduleFrequencyInterval?.type]
            : []
        }
        getKeyForOption={t => t}
        getLabelForOption={t => SCHEDULE_FREQUENCY_INTERVAL_LABELS[t]}
        options={OPTIONS}
        onPressOption={onSelectType}
        closeOnSelect={true}
        style={standardFormElementSpacing()}
      />
      {scheduleFrequencyInterval?.type === 'specific-days' && (
        <WeekDaySelector
          selected={scheduleFrequencyInterval.days ?? []}
          setScheduleFrequencyInterval={setScheduleFrequencyInterval}
        />
      )}
      {scheduleFrequencyInterval?.type === 'recurring-interval' && (
        <RecurringFrequencySelector
          selected={scheduleFrequencyInterval.intervals ?? []}
          setScheduleFrequencyInterval={setScheduleFrequencyInterval}
        />
      )}
    </MedicationFormCard>
  );
};

// const styles = StyleSheet.create({});
