import {MedsenseTextInput} from '@app/components/TextInput';
import {MedsenseDateInput} from '@app/components/DateInput';
import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {ListToggle} from '@app/components/ListToggle';
import {MedsenseText} from '@app/components/Text';
import {
  CuratedQuantityOption,
  CURATED_QUANTITIES,
  isQuantitySelectionSubmittable,
  TIME_FORMAT,
  getHeader,
  DosageEvent,
} from './model';

type TimeAndQuantityEntryCardProps = {
  currentDosageEvent: DosageEvent;
  onChangeDosageEvent(updatedDosageEvent: DosageEvent): void;
  getDosageEventLabel: (dosageEvent: DosageEvent) => string;
  timeIndex: number;
  onPressNext(): void;
  onPressBack(): void;
};

export const TimeAndQuantityEntryCard: React.FC<
  TimeAndQuantityEntryCardProps
> = ({
  onPressBack,
  onPressNext,
  timeIndex,
  currentDosageEvent,
  onChangeDosageEvent,
  getDosageEventLabel,
}) => {
  const copy = React.useMemo(() => {
    return getHeader(timeIndex);
  }, [timeIndex]);

  const time = React.useMemo(
    () => currentDosageEvent.time,
    [currentDosageEvent],
  );
  const selectedQuantity = React.useMemo(
    () => currentDosageEvent.quantity,
    [currentDosageEvent],
  );

  const onSelectCuratedQuantity = React.useCallback(
    (curatedQuantity: CuratedQuantityOption) => {
      if (curatedQuantity.value) {
        onChangeDosageEvent({
          time: currentDosageEvent.time,
          quantity: {
            type: 'preselected',
            value: curatedQuantity.value,
          },
        });
      } else {
        onChangeDosageEvent({
          time: currentDosageEvent.time,
          quantity: {
            type: 'freeform',
            value: null,
          },
        });
      }
    },
    [onChangeDosageEvent, currentDosageEvent],
  );

  const curatedQuantitySelectedValues = React.useMemo(() => {
    if (selectedQuantity?.type !== 'preselected') {
      return selectedQuantity
        ? [CURATED_QUANTITIES[CURATED_QUANTITIES.length - 1]]
        : [];
    }

    const option = CURATED_QUANTITIES.find(
      x => x.value === selectedQuantity.value,
    );
    return option ? [option] : null;
  }, [selectedQuantity]);

  const onChangeFreeformQuantity = React.useCallback(
    (value: string) => {
      onChangeDosageEvent({
        time: currentDosageEvent.time,
        quantity: {
          type: 'freeform',
          value,
        },
      });
    },
    [onChangeDosageEvent, currentDosageEvent],
  );

  const areTimeAndQuantityValid = React.useMemo(() => {
    return (
      time !== null &&
      selectedQuantity !== null &&
      isQuantitySelectionSubmittable(selectedQuantity)
    );
  }, [selectedQuantity, time]);

  const onPressNextWrapped = React.useCallback(() => {
    if (!time || !selectedQuantity) {
      return;
    }

    onPressNext();
  }, [time, selectedQuantity, onPressNext]);

  const dosageSummary = React.useMemo(() => {
    if (!selectedQuantity || !time) {
      return null;
    }

    return getDosageEventLabel({time, quantity: selectedQuantity});
  }, [selectedQuantity, getDosageEventLabel, time]);

  const setTime = React.useCallback(
    (newTime: Date) => {
      onChangeDosageEvent({
        time: newTime,
        quantity: currentDosageEvent.quantity,
      });
    },
    [onChangeDosageEvent, currentDosageEvent],
  );

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={!areTimeAndQuantityValid}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <MedsenseDateInput
        label={copy.timeLabel}
        emptyText={copy.timePlaceholder}
        value={time}
        onChange={setTime}
        dateFormat={TIME_FORMAT}
        datePickerMode="time"
        defaultValue={new Date()}
      />
      <ListToggle<CuratedQuantityOption>
        label={copy.curatedQuantityLabel}
        emptyText={copy.curatedQuantityPlaceholder}
        selectedValues={curatedQuantitySelectedValues}
        options={CURATED_QUANTITIES}
        getLabelForOption={v => v.label}
        getKeyForOption={v => v.label}
        onPressOption={onSelectCuratedQuantity}
        closeOnSelect={true}
        style={standardFormElementSpacing()}
      />
      {selectedQuantity?.type === 'freeform' && (
        <MedsenseTextInput
          label={copy.freeformQuantityLabel}
          placeholder={copy.freeformQuantityPlaceholder}
          value={selectedQuantity.value ?? ''}
          onChangeText={onChangeFreeformQuantity}
          style={standardFormElementSpacing()}
          keyboardType="decimal-pad"
        />
      )}
      <MedsenseText style={margin('vertical', 'p2')}>
        {copy.dosageSummary}
      </MedsenseText>
      {dosageSummary && (
        <MedsenseText flavor="accent" size="h2" style={margin('bottom', 'p2')}>
          {dosageSummary}
        </MedsenseText>
      )}
    </MedicationFormCard>
  );
};
