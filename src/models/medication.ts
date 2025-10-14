import {
  BeaconColor,
  BEACON_RAW_MAPPING,
  BEACON_COLOR_CONSTANTS,
} from './beacon';
import {ColorTypeModel} from './beacon';

export type ScheduleFrequencyIntervalType =
  | 'daily'
  | 'specific-days'
  | 'recurring-interval'
  | 'as-needed';

export const SCHEDULE_FREQUENCY_INTERVAL_LABELS: Record<
  ScheduleFrequencyIntervalType,
  string
> = {
  daily: 'Every Day',
  'specific-days': 'Specific Days',
  'recurring-interval': 'Recurring Interval',
  'as-needed': 'As needed',
};

export type BeaconModel = {
  id: number;
  name: string;
  code: string;
  weeklyBeaconSetId: number | null;
};

export type MedicationContainer = {
  id: number;
  name: string;
  position: number;
  isPillOrganizer: boolean;
  isBottle: boolean;
};

export type MedicationTypeModel = {
  id: number;
  name: string;
};

export type DosageTypeModel = {
  id: number;
  name: string;
};

export const getBeaconColorForColorTypeModel = (
  model: ColorTypeModel,
): BeaconColor => {
  return BEACON_RAW_MAPPING[model.id];
};

export const isColorTypeLight = (colorType: ColorTypeModel) => {
  const color = getBeaconColorForColorTypeModel(colorType);
  return color === BeaconColor.white || color === BeaconColor.transparent;
};

export const isMedicationColorLight = (model: Medication): boolean => {
  if (!model.colorType) {
    return false;
  }

  return isColorTypeLight(model.colorType);
};

export const getColorFromColorType = (colorType: ColorTypeModel) => {
  const color = getBeaconColorForColorTypeModel(colorType);
  return BEACON_COLOR_CONSTANTS[color];
};

export const getColorForMedication = (
  medication: Medication,
): string | undefined => {
  return medication.colorType
    ? getColorFromColorType(medication.colorType)
    : undefined;
};

export type ScheduleModel = {
  id: number;
  medicamentId: number;
  weekDay: string;
  periodRange: number;
};

export type ScheduleTimeModel = {
  id: number;
  scheduleId: number;
  quantity: number;
  date: Date;
};

export type MedicationStatisticPeriodStatus = 'fail' | 'success';

export type MedicationStatisticPeriod = {
  id: number;
  medicamentId: number;
  date: Date;
  time: Date;
  actualTime: Date;
  status: MedicationStatisticPeriodStatus;
};

export type Medication = {
  id: number;
  type: string;
  frequency: ScheduleFrequencyIntervalType;
  medicationTypeId: number;
  name: string;
  image: string;
  information: string;
  dosage: number;
  dosageTypeId: number;
  colorTypeId: number;
  beaconId: number;
  isActivePush: boolean;
  isActivePushBefore: boolean;
  pushOnlyForget: number;
  // expansion
  category: MedicationContainer | null;
  medicationType: MedicationTypeModel | null;
  dosageType: DosageTypeModel | null;
  colorType: ColorTypeModel | null;
  schedules: ScheduleModel[] | null;
  scheduleTimes: ScheduleTimeModel[] | null;
  beacon: BeaconModel | null;
  weeklyBeacons: BeaconModel[] | null;
  beaconSetIds: number[] | null;
  activeSchedule: ScheduleModel | null;
  activeScheduleTime: ScheduleTimeModel | null;
  statisticPeriods: MedicationStatisticPeriod[] | null;
  credits: number | null;
};

export const getMedicationDosageDescriptor = (
  medication: Medication,
): string => {
  const {dosage, dosageType} = medication;
  return dosageType ? `${dosage} ${dosageType.name}` : `${dosage}`;
};

const shortWeekTitle = (scheduleModel: ScheduleModel): string => {
  const apiMapping: any = {
    sun: 'SN',
    mon: 'MN',
    tue: 'TU',
    wed: 'WD',
    thu: 'TH',
    fri: 'FR',
    sat: 'SA',
  };

  return apiMapping[scheduleModel.weekDay as any] ?? '';
};

const getDayIndexForSchedule = (scheduleModel: ScheduleModel) => {
  const apiMapping: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  return apiMapping[scheduleModel.weekDay];
};

export const RECURRING_FREQUENCY_DESCRIPTOR_MAPPING: any = {
  2: 'Every second day',
  3: 'Every 3rd day',
  4: 'Every 4th day',
  5: 'Every 5th day',
  6: 'Every 6th day',
  7: 'Every 7th day',
  8: 'Every 8th day',
};

export type WeekDay = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export const FULL_DAY_MAPPING: Record<WeekDay, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

export const nextDoseDay = (medication: Medication) => {
  if (medication.frequency === 'specific-days') {
    const dayToday = new Date().getDay();

    if (medication.schedules) {
      const nextInCurrentWeek = medication.schedules.find(
        i => getDayIndexForSchedule(i) > dayToday,
      );
      if (nextInCurrentWeek) {
        return FULL_DAY_MAPPING[nextInCurrentWeek.weekDay as WeekDay];
      }

      const nextInNextWeek = medication.schedules.find(
        i => getDayIndexForSchedule(i) < dayToday,
      );
      if (nextInNextWeek) {
        return FULL_DAY_MAPPING[nextInNextWeek.weekDay as WeekDay];
      }
    }
  }
};

export const getScheduleFrequencyDescriptor = (
  medication: Medication,
): string => {
  if (medication.frequency === 'specific-days') {
    let weekdays = ['SN', 'MN', 'TU', 'WD', 'TH', 'FR', 'SA'];
    let daysTaken = [];

    if (medication.schedules) {
      for (let index in weekdays) {
        const day = weekdays[index];
        let isContains = medication.schedules.find(
          x => shortWeekTitle(x) === day,
        );

        if (isContains) {
          daysTaken.push(day);
        }
      }
    }

    return daysTaken.join(', ');
  } else {
    return (
      medication.schedules
        ?.map(schedule => {
          if (medication.frequency === 'recurring-interval') {
            return RECURRING_FREQUENCY_DESCRIPTOR_MAPPING[schedule.periodRange];
          } else if (
            medication.scheduleTimes &&
            medication.scheduleTimes?.length > 1
          ) {
            return `${medication.scheduleTimes.length} times per day`;
          } else {
            return 'Every day';
          }
        })
        .join(' ') ?? ''
    );
  }
};

//     self.scheduleLabel.text = stringFrequencies.uppercased()

// }

// var times = ""

// if let scheduleTimes = medicament.scheduleTimes {
//     for (index, scheduleTime) in scheduleTimes.enumerated() {

//         if index == MedicamentCellV2.maxLine {
//             times.append("...")
//             break
//         }

//         times.append(scheduleTime.time)
//         var dosageString: String {
//             if medicament.dosage > 0 {
//                 return " ( \(medicament.dosageString(scheduleTime.quantity)) )"
//             } else {
//                 return ""
//             }
//         }

//         if (index + 1) != scheduleTimes.count {
//             times.append("\n")
//         }
//     }
// }

// self.timeLabel.text = times

export const pluralMedicationType = (
  medicationType: MedicationTypeModel,
  quantity: number,
): string => {
  var str = medicationType.name;
  if (str.includes('(s)')) {
    str = str.substring(0, str.length - 3);
  } else if (str.includes('s')) {
    str = str.substring(0, str.length - 1);
  }

  if (quantity > 1) {
    str += 's';
  }

  return str;
};

const quantityAsFraction = (quantity: number): string => {
  if (quantity === 0.25) {
    return '1/4';
  } else if (quantity === 0.5) {
    return '1/2';
  } else if (quantity === 0.75) {
    return '3/4';
  }

  return `${quantity}`;
};

export const quantityNowLabel = (medication: Medication) => {
  const quantity = medication.activeScheduleTime?.quantity ?? 1;
  return (
    quantityAsFraction(quantity) +
    ' ' +
    (medication.medicationType
      ? pluralMedicationType(medication.medicationType, quantity)
      : '') +
    ' now'
  );
};

export const isMedicationMultiBeacon = (medication: Medication) => {
  return (
    !!medication.category?.isPillOrganizer ||
    [13].includes(medication.category?.id!)
  );
};

export const RETAINER_CONTAINER_ID = 9;
export const SMARTBOX_CONTAINER_ID = 13;

export const isSmartBoxMedication = (medication: Medication): boolean => {
  return medication.category?.id === SMARTBOX_CONTAINER_ID;
};
