import {FreeBeaconModel, NormalizedBeaconSet} from '@app/models/beacon';
import {
  RECURRING_FREQUENCY_DESCRIPTOR_MAPPING,
  FULL_DAY_MAPPING,
  MedicationContainer,
  WeekDay,
  DosageTypeModel,
  MedicationTypeModel,
  Medication,
} from '@app/models/medication';
import {format} from 'date-fns';
import {PhotoFile} from 'react-native-vision-camera';

export type NotificationType = 'every-dose' | 'when-i-forget';

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  'every-dose': 'For every dose',
  'when-i-forget': 'When I forget',
};

export const getNotificationTypeDescriptor = (
  type: NotificationType,
): string => {
  return NOTIFICATION_TYPE_LABELS[type];
};

export type ScheduleFrequencyInterval =
  | {
      type: 'daily';
    }
  | {
      type: 'specific-days';
      days?: WeekDay[];
    }
  | {
      type: 'recurring-interval';
      intervals?: number[];
    }
  | {
      type: 'as-needed';
    };

export const TIME_FORMAT = 'h:mm a';

export const isScheduleFrequencyIntervalValid = (
  schedule: ScheduleFrequencyInterval,
) => {
  return (
    (schedule.type === 'recurring-interval' &&
      (schedule.intervals?.length ?? 0) > 0) ||
    (schedule.type === 'specific-days' && (schedule.days?.length ?? 0) > 0) ||
    schedule.type === 'daily' ||
    schedule.type === 'as-needed'
  );
};

export const isMedicationPRN = (medication: MedicationViewModel): boolean => {
  return medication.scheduleFrequencyInterval?.type === 'as-needed';
};

// Credit https://stackoverflow.com/questions/20425771/how-to-replace-1-with-first-2-with-second-3-with-third-etc
const ORDINAL_SPECIAL = [
  'zeroth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
];
const ORDINAL_DECA = [
  'twent',
  'thirt',
  'fort',
  'fift',
  'sixt',
  'sevent',
  'eight',
  'ninet',
];

export const getOrdinal = (n: number) => {
  if (n < 20) {
    return ORDINAL_SPECIAL[n];
  }

  if (n % 10 === 0) {
    return ORDINAL_DECA[Math.floor(n / 10) - 2] + 'ieth';
  }

  return ORDINAL_DECA[Math.floor(n / 10) - 2] + 'y-' + ORDINAL_SPECIAL[n % 10];
};

export const containerTypeDosageText = (
  medicationType: MedicationTypeModel | null,
) => {
  return medicationType?.name.toUpperCase() ?? 'pill';
};

export const isStringValidNumber = (str: string) => !isNaN(Number(str));

export const singleDosageText = (
  dosageType: DosageTypeModel | null,
  dosageQuantity: string | number,
): string | null => {
  if (!dosageType) {
    return null;
  }

  return `${dosageQuantity} ${dosageType.name}`;
};

export type MedicationDosageTime = {
  time: Date;
  quantity: number;
};

export type UploadedFile = {
  uploadPath: string;
};

export const isUploadedPhoto = (
  photo: PhotoFile | UploadedFile,
): photo is UploadedFile => {
  return !!(photo as UploadedFile)?.uploadPath;
};

export type MedicationViewModel = {
  // color: unknown;
  // distanceNotification: unknown;
  // dosage: unknown;
  // image: unknown;
  // information: unknown;
  // isRepeatDistanceNotification: unknown;
  // lastActivePush: unknown;
  id?: number;

  name: string;
  // pushOnlyForget: boolean;
  medicationType: MedicationTypeModel | null;

  // TODO: map to pushOnlyForget
  notificationType: NotificationType | null;
  scheduleFrequencyInterval: ScheduleFrequencyInterval | null;

  dosageType: DosageTypeModel | null;
  dosageQuantity: string;

  dosageTimes: MedicationDosageTime[] | null;

  container: MedicationContainer | null;

  beacon?: FreeBeaconModel;

  photo?: PhotoFile | UploadedFile;

  organizers?: NormalizedBeaconSet[];
};

export type WizardSteps =
  | 'container'
  | 'name'
  | 'type'
  | 'beacon'
  | 'reminders'
  | 'schedule'
  | 'dosage'
  | 'photo'
  | 'timesPerDay';

export const convertAPIMedicationFrequencyToViewModel = (
  medication: Medication,
): ScheduleFrequencyInterval | null => {
  if (medication.type === 'prn') {
    return {
      type: 'as-needed',
    };
  }

  switch (medication.frequency) {
    case 'daily':
      return {
        type: 'daily',
      };
    case 'recurring-interval':
      return {
        type: 'recurring-interval',
        intervals: medication.schedules?.map(s => s.periodRange),
      };
    case 'specific-days':
      return {
        type: 'specific-days',
        days: medication.schedules?.map(s => s.weekDay as WeekDay),
      };
    default:
      return null;
  }
};

export const convertAPIMedicationToViewModel = (
  medication: Medication,
  beaconSets: NormalizedBeaconSet[],
): MedicationViewModel => {
  const weeklyBeaconIds = new Set(medication.beaconSetIds);
  return {
    id: medication.id,
    name: medication.name,
    notificationType: medication.pushOnlyForget
      ? 'when-i-forget'
      : 'every-dose',
    medicationType: medication.medicationType ?? null,
    scheduleFrequencyInterval:
      convertAPIMedicationFrequencyToViewModel(medication),
    dosageType: medication.dosageType,
    dosageQuantity: medication.dosage ? `${medication.dosage}` : '1',
    dosageTimes:
      medication.scheduleTimes?.map((time): MedicationDosageTime => {
        return {
          time: time.date,
          quantity: time.quantity,
        };
      }) ?? null,
    container: medication.category,
    photo: medication.image ? {uploadPath: medication.image} : undefined,
    beacon: medication.beacon
      ? {
          beaconId: medication.beacon.id,
          name: medication.beacon.name,
          uuid: medication.beacon.code,
          colorTypeId: medication.colorTypeId,
          weeklyBeaconSetId: medication.beacon.weeklyBeaconSetId,
          used: true,
        }
      : undefined,
    organizers: medication.weeklyBeacons
      ? beaconSets.filter(b => weeklyBeaconIds.has(b.id))
      : undefined,
  };
};

export const newMedicationViewModel = (): MedicationViewModel => {
  return {
    container: null,
    name: '',
    medicationType: null,
    notificationType: null,
    scheduleFrequencyInterval: null,
    dosageQuantity: '',
    dosageType: null,
    dosageTimes: null,
  };
};

export const SMART_BOX_ID = 13;
export const PILL_ORGANIZER_ID = 1;
export const SPECIALITY_CONTAINER_IDS = [SMART_BOX_ID, PILL_ORGANIZER_ID];

export const isMedicationMultiBeacon = (medication: MedicationViewModel) => {
  return (
    !!medication.container?.isPillOrganizer ||
    SPECIALITY_CONTAINER_IDS.includes(medication.container?.id!)
  );
};

export const getDosageTimeDescriptors = (medication: MedicationViewModel) => {
  if (!medication.dosageTimes?.length) {
    return [
      singleDosageText(medication.dosageType, medication.dosageQuantity!),
    ];
  }

  return (
    medication.dosageTimes?.map(dosageTime => {
      return `take ${dosageTime.quantity} (${singleDosageText(
        medication.dosageType,
        medication.dosageQuantity!,
      )}) at ${format(dosageTime.time, TIME_FORMAT)}`;
    }) ?? []
  );
};

export const getDosageDescriptor = (
  medication: MedicationViewModel,
): string | null => {
  const formattedDosageTimeText =
    getDosageTimeDescriptors(medication).join(', ');
  if (medication.scheduleFrequencyInterval?.type === 'daily') {
    return 'Every day ' + formattedDosageTimeText;
  } else if (
    medication.scheduleFrequencyInterval?.type === 'recurring-interval'
  ) {
    return (
      medication.scheduleFrequencyInterval.intervals
        ?.map(day => {
          return `${RECURRING_FREQUENCY_DESCRIPTOR_MAPPING[day]} at ${formattedDosageTimeText}`;
        })
        ?.join('\n') ?? null
    );
  } else if (medication.scheduleFrequencyInterval?.type === 'as-needed') {
    return formattedDosageTimeText;
  } else {
    return (
      medication.scheduleFrequencyInterval?.days
        ?.map(day => {
          return `${FULL_DAY_MAPPING[day]} ${formattedDosageTimeText}`;
        })
        ?.join('\n') ?? null
    );
  }
};
