import {WeekDay} from './medication';

export type ColorTypeModel = {
  id: number;
  name: string;
  r: number;
  g: number;
  b: number;
  isWithoutBeacon: boolean;
};

export interface Hub {
  deviceName: string;
  ipAddress: string;
  hardwareVersion: string;
  bootCount: number;
  beaconCount: number;
  timeFromCurrent: number;
  timeFromLastSend: number;
  softwareVersion: string;
  lastBeaconUuid: string;
  // createdAt:          Date;
  // updatedAt:          Date;
  alert: Alert;
}

export interface FreeBeaconExpanded {
  id: number;
  userId: number;
  uuid: string;
  name: string;
  colorTypeId: number;
  status: number;
  created: number;
  colorType: ColorTypeModel;
  device: BeaconDeviceDetails | null;
  alert: Alert;
}

export interface Alert {
  type: string;
  value: boolean;
  status: string;
  level: number;
  severity: number;
}

export const doesAlertSignifyOnline = (alert: Alert): boolean => {
  return alert.severity === 1;
};

export interface BeaconDeviceDetails {
  uuid: string;
  ipAddress: string;
  messageVersion: number;
  sensorName: string;
  battery: number;
  broadcastChannel: null;
  signalStrength: number;
  x: string;
  y: string;
  z: string;
  delta: number;
  createdAt: Date;
  updatedAt: Date;
}

export type FreeBeaconModel = {
  beaconId: number;
  name: string;
  uuid: string;
  colorTypeId: number;
  weeklyBeaconSetId: number | null;
  used: boolean | null;
};

export enum BeaconColor {
  red = 1,
  blue,
  black,
  yellow,
  green,
  purple,
  grey,
  white,
  orange,
  pink,
  /// without beacon
  transparent,
  /// weekly pill organizer
  organizer,
}

export const BEACON_RAW_MAPPING: Record<number, BeaconColor> = {
  1: BeaconColor.red,
  2: BeaconColor.blue,
  3: BeaconColor.black,
  4: BeaconColor.yellow,
  5: BeaconColor.green,
  6: BeaconColor.purple,
  7: BeaconColor.grey,
  8: BeaconColor.white,
  9: BeaconColor.orange,
  10: BeaconColor.pink,
  /// without beacon
  11: BeaconColor.transparent,
  /// weekly pill organizer
  12: BeaconColor.organizer,
};

export const BEACON_COLOR_CONSTANTS: Record<BeaconColor, string> = {
  [BeaconColor.red]: '#EA6A76',
  [BeaconColor.blue]: '#4885C2',
  [BeaconColor.black]: '#576068',
  [BeaconColor.yellow]: '#F0BE42',
  [BeaconColor.green]: '#34B46A',
  [BeaconColor.purple]: '#AD6EAA',
  [BeaconColor.grey]: '#7E8892',
  [BeaconColor.white]: '#FFFFFF',
  [BeaconColor.orange]: '#F69179',
  [BeaconColor.pink]: '#F27AE2',
  [BeaconColor.transparent]: '#EFF4F8',
  [BeaconColor.organizer]: '#FFA85E',
  // [BeaconColor.cross]: '#FFFFFF',
};

export const getBeaconColor = (freeBeacon: FreeBeaconModel): string => {
  const beaconModelColor = BEACON_NAME_COLOR_MAPPING[freeBeacon.name];
  const color = BEACON_COLOR_CONSTANTS[beaconModelColor];
  return color;
};

const BEACON_LABEL_CONSTANTS: Record<BeaconColor, string> = {
  [BeaconColor.red]: 'Red',
  [BeaconColor.blue]: 'Blue',
  [BeaconColor.black]: 'Black',
  [BeaconColor.yellow]: 'Yellow',
  [BeaconColor.green]: 'Green',
  [BeaconColor.purple]: 'Purple',
  [BeaconColor.grey]: 'Grey',
  [BeaconColor.white]: 'White',
  [BeaconColor.orange]: 'Orange',
  [BeaconColor.pink]: 'Pink',
  [BeaconColor.transparent]: 'Transparent',
  [BeaconColor.organizer]: 'Weekly pill organizer',
};

export const getBeaconLabel = (freeBeacon: FreeBeaconModel): string => {
  const beaconModelColor = BEACON_NAME_COLOR_MAPPING[freeBeacon.name];
  const label = BEACON_LABEL_CONSTANTS[beaconModelColor];
  return label;
};

const BEACON_NAME_COLOR_MAPPING: Record<string, BeaconColor> = {
  S00001: BeaconColor.red,
  S00002: BeaconColor.blue,
  S00003: BeaconColor.black,
  S00004: BeaconColor.yellow,
  S00005: BeaconColor.green,
  S00006: BeaconColor.purple,
  S00007: BeaconColor.grey,
  S00008: BeaconColor.white,
  S00009: BeaconColor.orange,
  S00010: BeaconColor.pink,
};

export const getAvailableColors = (
  freeBeacons: FreeBeaconModel[],
): BeaconColor[] => {
  return freeBeacons.map(b => BEACON_NAME_COLOR_MAPPING[b.name]);
};

export enum WeeklyBeaconType {
  sunday = 'S00011',
  monday = 'S00012',
  tuesday = 'S00013',
  wednesday = 'S00014',
  thursday = 'S00015',
  friday = 'S00016',
  saturday = 'S00017',
}

export const WEEKLY_BEACON_TYPE_MAPPING: Record<WeeklyBeaconType, string> = {
  [WeeklyBeaconType.sunday]: 'Sunday',
  [WeeklyBeaconType.monday]: 'Monday',
  [WeeklyBeaconType.tuesday]: 'Tuesday',
  [WeeklyBeaconType.wednesday]: 'Wednesday',
  [WeeklyBeaconType.thursday]: 'Thursday',
  [WeeklyBeaconType.friday]: 'Friday',
  [WeeklyBeaconType.saturday]: 'Saturday',
};

export const WEEKLY_BEACON_DAY_VALUE_MAPPING: Record<number, WeeklyBeaconType> =
  {
    1: WeeklyBeaconType.sunday,
    2: WeeklyBeaconType.monday,
    3: WeeklyBeaconType.tuesday,
    4: WeeklyBeaconType.wednesday,
    5: WeeklyBeaconType.thursday,
    6: WeeklyBeaconType.friday,
    7: WeeklyBeaconType.saturday,
  };

export const WEEKLY_BEACON_DAY_ABBRV_MAPPING: Record<
  WeekDay,
  WeeklyBeaconType
> = {
  sun: WeeklyBeaconType.sunday,
  mon: WeeklyBeaconType.monday,
  tue: WeeklyBeaconType.tuesday,
  wed: WeeklyBeaconType.wednesday,
  thu: WeeklyBeaconType.thursday,
  fri: WeeklyBeaconType.friday,
  sat: WeeklyBeaconType.saturday,
};

export const getWeeklyBeaconFillCount = (
  weeklyFreeBeacons: FreeBeaconModel[],
) => {
  return weeklyFreeBeacons
    .filter(b => !b.used)
    .reduce((singleSet, b) => {
      if (b.weeklyBeaconSetId !== null) {
        singleSet[b.weeklyBeaconSetId] =
          (singleSet[b.weeklyBeaconSetId] ?? 0) + 1;
      }

      return singleSet;
    }, {} as {[beaconId: number]: number});
};

export type NormalizedBeaconSet = {
  id: number;
  name: string;
  beacons: (FreeBeaconModel & {day: string})[];
};

export const doesBeaconSetHaveUnusedBeacons = (
  beaconSet: NormalizedBeaconSet,
): boolean => {
  return beaconSet.beacons.some(b => !b.used);
};
