import {format} from 'date-fns';
import {
  getOrdinal,
  isStringValidNumber,
  MedicationViewModel,
  containerTypeDosageText,
  singleDosageText,
  MedicationDosageTime,
} from '../../model';
export type CuratedQuantityOption = {
  label: string;
  value: number | null;
};

export const getHeader = (index: number) => {
  const doseOrdinal = capFirstLetter(getOrdinal(index + 1));
  return {
    heading: `${doseOrdinal} Dose Schedule`,
    subheading: `Please select the time and quantity of your ${doseOrdinal} dose of the day.`,
    timeLabel: `Time of your ${doseOrdinal} dose`,
    timePlaceholder: `Select time of ${doseOrdinal} dose...`,

    curatedQuantityLabel: `Quantity of your ${doseOrdinal} dose`,
    curatedQuantityPlaceholder: `Select quantity of ${doseOrdinal} dose....`,

    freeformQuantityLabel: `Quantity of your ${doseOrdinal} dose`,
    freeformQuantityPlaceholder: `Enter quantity of ${doseOrdinal} dose....`,

    dosageSummary: `${doseOrdinal} dose summary:`,
  };
};

export type DosageEvent = {time: Date; quantity: QuantitySelection};

export const dosageEventLabelFactory = (
  medication: MedicationViewModel,
): ((event: DosageEvent) => string) => {
  return (event: DosageEvent) => {
    const {quantity, time} = event;
    const type = containerTypeDosageText(medication.medicationType);
    const quantityLabel = quantityForDosageSummaryFromSelection(quantity);

    return `${quantityLabel} ${type} (${singleDosageText(
      medication.dosageType,
      medication.dosageQuantity!,
    )}) at ${format(time, TIME_FORMAT)}`;
  };
};

export const transformDosageEventToMedicationDosageTime = (
  dosageEvents: DosageEvent[],
): MedicationDosageTime[] => {
  return dosageEvents.map((dosageEvent): MedicationDosageTime => {
    return {
      time: dosageEvent.time,
      quantity:
        dosageEvent.quantity.type === 'preselected'
          ? dosageEvent.quantity.value
          : Number(dosageEvent.quantity.value),
    };
  });
};

export const transformMedicationViewModelToEvents = (
  medication: MedicationViewModel,
): DosageEvent[] | null => {
  if (!medication.dosageTimes) {
    if (medication.organizers) {
      return medication.organizers.map(() => createDefaultDosageEvent());
    }

    return null;
  }

  return medication.dosageTimes.map(dosageEvent => {
    const possibleQuantity = CURATED_QUANTITIES.find(
      q => q.value === dosageEvent.quantity,
    );
    if (possibleQuantity) {
      return {
        time: dosageEvent.time,
        quantity: {
          type: 'preselected',
          value: possibleQuantity.value!,
        },
      };
    }

    return {
      time: dosageEvent.time,
      quantity: {
        type: 'freeform',
        value: `${dosageEvent.quantity}`,
      },
    };
  });
};

export const CURATED_QUANTITIES: CuratedQuantityOption[] = [
  {label: '1/4', value: 0.25},
  {label: '1/2', value: 0.5},
  {label: '3/4', value: 0.75},
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
  {label: '7', value: 7},
  {label: '8', value: 8},
  {label: '9', value: 9},
  {label: '10', value: 10},
  {label: 'Other', value: null},
];

export const createDefaultDosageEvent = (): DosageEvent => {
  return {
    time: new Date(),
    quantity: {
      type: 'preselected',
      value: CURATED_QUANTITIES[0].value!,
    },
  };
};

export type QuantitySelection =
  | {
      type: 'preselected';
      value: number;
    }
  | {
      type: 'freeform';
      value: string | null;
    };

export const isQuantitySelectionSubmittable = (
  selection: QuantitySelection,
): boolean => {
  return (
    selection.type === 'preselected' ||
    (selection.value !== null && isStringValidNumber(selection.value))
  );
};

export const quantityForDosageSummaryFromSelection = (
  selection: QuantitySelection,
): number | string => {
  if (selection.type === 'freeform' && selection.value) {
    return selection.value;
  } else if (selection.type === 'preselected') {
    return (
      CURATED_QUANTITIES.find(x => x.value === selection.value)?.label ?? '#'
    );
  }

  return '#';
};

export const TIME_FORMAT = 'h:mm bbb';

export const capFirstLetter = (text: string): string => {
  if (!text.length) {
    return text;
  }

  return text.charAt(0).toUpperCase() + text.substring(1);
};
