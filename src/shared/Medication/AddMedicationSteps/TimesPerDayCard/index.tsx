import * as React from 'react';
import {EnterTimesPerDayCard} from './EnterTimesPerDay';
import {MedicationViewModel} from '../../model';
import {TimeAndQuantityEntryCard} from './TimeAndQuantityEntryCard';
import {
  transformMedicationViewModelToEvents,
  DosageEvent,
  dosageEventLabelFactory,
  transformDosageEventToMedicationDosageTime,
  createDefaultDosageEvent,
} from './model';

type EnterTimesPerDayProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

export const TimesPerDayCard: React.FC<EnterTimesPerDayProps> = ({
  onPressBack,
  onPressNext,
  medication,
}) => {
  const [timeIndex, setTimeIndex] = React.useState<number | null>(
    medication.organizers ? 0 : null,
  );
  const [times, setTimes] = React.useState<DosageEvent[]>(
    transformMedicationViewModelToEvents(medication) ?? [],
  );

  const onPressNextFromTimeAndQuantity = React.useCallback(() => {
    if (timeIndex !== null && timeIndex + 1 === times.length) {
      onPressNext({
        ...medication,
        dosageTimes: transformDosageEventToMedicationDosageTime(times),
      });
    } else {
      setTimeIndex(timeIndex! + 1);
    }
  }, [times, timeIndex, onPressNext, medication]);

  const onPressBackFromTimeAndQuantity = React.useCallback(() => {
    if (timeIndex && timeIndex > 1) {
      setTimeIndex(timeIndex - 1);
    } else {
      setTimeIndex(null);
    }
  }, [timeIndex]);

  const getDosageEventLabel = React.useMemo((): ((
    dosageEvent: DosageEvent,
  ) => string) => {
    return dosageEventLabelFactory(medication);
  }, [medication]);

  const onEnterNumberOfTime = React.useCallback(
    (newTimesPerDay: number) => {
      if (times.length > newTimesPerDay) {
        setTimes(times.slice(0, newTimesPerDay));
      } else {
        const newTimes = [...times];
        newTimes.length = newTimesPerDay;
        newTimes.fill(createDefaultDosageEvent(), times.length, newTimesPerDay);

        setTimes(newTimes);
      }
      setTimeIndex(0);
    },
    [times, setTimes, setTimeIndex],
  );

  const currentDosageEvent = React.useMemo(() => {
    if (timeIndex === null) {
      return null;
    }

    return times[timeIndex];
  }, [times, timeIndex]);

  const onChangeDosageEvent = React.useCallback(
    (dosageEvent: DosageEvent) => {
      const newTimes = [...times];

      newTimes[timeIndex!] = dosageEvent;

      setTimes(newTimes);
    },
    [times, timeIndex, setTimes],
  );

  if (!currentDosageEvent) {
    return (
      <EnterTimesPerDayCard
        initialValue={times.length === 0 ? null : times.length}
        onPressNext={onEnterNumberOfTime}
        onPressBack={onPressBack}
      />
    );
  } else {
    return (
      <TimeAndQuantityEntryCard
        timeIndex={timeIndex!}
        getDosageEventLabel={getDosageEventLabel}
        onPressNext={onPressNextFromTimeAndQuantity}
        onPressBack={onPressBackFromTimeAndQuantity}
        currentDosageEvent={currentDosageEvent}
        onChangeDosageEvent={onChangeDosageEvent}
        key={`time-${timeIndex}`}
      />
    );
  }
};
