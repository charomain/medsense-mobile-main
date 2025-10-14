import {MedsenseAPIRequestFactory} from '../types';
import {MedsenseAPIParsingError} from '../types';
import {parseDate, parseTime, parseGenericArray, parseNullable} from './utils';
import {
  BeaconModel,
  MedicationContainer,
  MedicationTypeModel,
  DosageTypeModel,
  ScheduleModel,
  ScheduleTimeModel,
  MedicationStatisticPeriod,
  Medication,
  ScheduleFrequencyIntervalType,
} from '@app/models/medication';
import {ColorTypeModel} from '@app/models/beacon';

const parseMedicationContainer = (
  response: Response,
  json: any,
): MedicationContainer => {
  if ((json as any).id) {
    return {
      id: Number(json.id),
      name: json.name,
      position: json.position,
      isPillOrganizer: json.is_pill_organizer,
      isBottle: json.is_bottle,
    };
  }

  throw new MedsenseAPIParsingError('GetMedicationContainers', json, response);
};

export const getMedicationContainersRequest: MedsenseAPIRequestFactory<
  void,
  MedicationContainer[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/medicament-category',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseMedicationContainer);
    },
  };
};

const parseMedicationTypeModel = (
  response: Response,
  json: any,
): MedicationTypeModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      name: json.name,
    };
  }

  throw new MedsenseAPIParsingError('MedicationTypeModel', json, response);
};

const parseDosageTypeModel = (
  response: Response,
  json: any,
): DosageTypeModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      name: json.name,
    };
  }

  throw new MedsenseAPIParsingError('DosageTypeModel', json, response);
};

export const parseColorTypeModel = (
  response: Response,
  json: any,
): ColorTypeModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      name: json.name,
      r: json.r,
      g: json.g,
      b: json.b,
      isWithoutBeacon: json.is_without_beacon,
    };
  }

  throw new MedsenseAPIParsingError('ColorTypeModel', json, response);
};

const parseScheduleModel = (response: Response, json: any): ScheduleModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      medicamentId: json.medicament_id,
      weekDay: json.week_day,
      periodRange: json.period_range,
    };
  }

  throw new MedsenseAPIParsingError('ScheduleModel', json, response);
};

const parseScheduleTimeModel = (
  response: Response,
  json: any,
): ScheduleTimeModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      scheduleId: json.schedule_id,
      date: parseTime(response, json, 'time'),
      quantity: json.quantity,
    };
  }

  throw new MedsenseAPIParsingError('ScheduleTimeModel', json, response);
};

const parseBeaconModel = (response: Response, json: any): BeaconModel => {
  if ((json as any).id) {
    return {
      id: json.id,
      name: json.name,
      code: json.code,
      weeklyBeaconSetId: json.weekly_beacon_set_id,
    };
  }

  throw new MedsenseAPIParsingError('BeaconModel', json, response);
};

const parseMedicationStatisticPeriod = (
  response: Response,
  json: any,
): MedicationStatisticPeriod => {
  return {
    id: json.id,
    medicamentId: json.medicament_id,
    date: parseDate(response, json, 'date'),
    time: parseTime(response, json, 'time'),
    actualTime: parseTime(response, json, 'actual_time'),
    status: json.status,
  };
};

const parseScheduleFrequencyIntervalType = (
  value: any,
): ScheduleFrequencyIntervalType => {
  if (value === 'daily') {
    return 'daily';
  } else if (value === 'weekly') {
    return 'specific-days';
  } else {
    return 'recurring-interval';
  }
};

export const parseMedication = (response: Response, json: any): Medication => {
  if ((json as any).id) {
    let activeSchedule: ScheduleModel | null = null;
    if (json.activeSchedule) {
      if (Array.isArray(json.activeSchedule)) {
        activeSchedule =
          parseGenericArray(
            response,
            json.activeSchedule,
            parseScheduleModel,
          )[0] ?? null;
      } else {
        activeSchedule = parseScheduleModel(response, json.activeSchedule);
      }
    }

    const weeklyBeacons = json.weekly_beacons
      ? parseGenericArray(response, json.weekly_beacons, parseBeaconModel)
      : null;

    return {
      id: json.id,
      type: json.type,
      frequency: parseScheduleFrequencyIntervalType(json.type),
      medicationTypeId: json.medication_type_id,
      name: json.name,
      image: json.image,
      information: json.information,
      dosage: json.dosage,
      dosageType: json.dosageType
        ? parseDosageTypeModel(response, json.dosageType)
        : null,
      dosageTypeId: json.dosage_type_id,
      colorTypeId: json.color_type_id,
      beaconId: json.beacon_id,
      isActivePush: !!json.is_active_push,
      isActivePushBefore: !!json.is_active_push_before,
      pushOnlyForget: json.push_only_forget,
      // expansion
      category: parseNullable(
        response,
        json.medicamentCategory,
        parseMedicationContainer,
      ),
      medicationType: parseNullable(
        response,
        json.medicationType,
        parseMedicationTypeModel,
      ),
      colorType: parseNullable(response, json.colorType, parseColorTypeModel),
      schedules: json.schedules
        ? parseGenericArray(response, json.schedules, parseScheduleModel)
        : null,
      scheduleTimes: json.scheduleTimes
        ? parseGenericArray(
            response,
            json.scheduleTimes,
            parseScheduleTimeModel,
          )
        : null,
      beacon: json.beacon ? parseBeaconModel(response, json.beacon) : null,
      weeklyBeacons,
      beaconSetIds:
        weeklyBeacons
          ?.map(b => b.weeklyBeaconSetId)
          .filter((b): b is number => !!b) || null,
      // for is active push
      activeSchedule,
      activeScheduleTime: json.activeScheduleTime
        ? parseScheduleTimeModel(response, json.activeScheduleTime)
        : null,
      // for statistics
      statisticPeriods: json.medicamentStatisticPeriod
        ? parseGenericArray(
            response,
            json.medicamentStatisticPeriod,
            parseMedicationStatisticPeriod,
          )
        : null,
      credits: null,
    };
  }

  throw new MedsenseAPIParsingError('GetMedicationContainers', json, response);
};

export const getMedicationsRequest: MedsenseAPIRequestFactory<
  void,
  Medication[]
> = () => {
  return {
    createFetchRequest() {
      const queryString = new URLSearchParams({
        expand:
          'medicationType, dosageType, colorType, schedules, scheduleTimes, beacon, activeSchedule, activeScheduleTime, medicamentCategory',
      });

      return {
        endpoint: `/medicaments?${queryString.toString()}`,
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseMedication);
    },
  };
};

export type SmartBoxCreditsRequest = {
  medicationId: number;
};

type GetSmartBoxCreditsResponse = {
  balance: 0;
};

export const getSmartBoxCreditsRequest: MedsenseAPIRequestFactory<
  SmartBoxCreditsRequest,
  GetSmartBoxCreditsResponse
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}/credits`,
        method: 'GET',
      };
    },
    parseResponse(_response, json) {
      return {
        balance: (json as any).balance ?? 0,
      };
    },
  };
};

export const reloadSmartBoxCreditsRequest: MedsenseAPIRequestFactory<
  SmartBoxCreditsRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}/credits/reload`,
        method: 'PUT',
      };
    },
    parseResponse() {},
  };
};

export const resetSmartBoxCreditsRequest: MedsenseAPIRequestFactory<
  SmartBoxCreditsRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}/credits/reset`,
        method: 'PUT',
      };
    },
    parseResponse() {},
  };
};

/*
  Save Medication
*/
export type ScheduleType = 'daily' | 'weekly' | 'period' | 'prn';

export type SaveMedicationRequest = {
  id?: number;
  scheduleType: ScheduleType;
  name: string;
  medicationTypeId: number;
  dosage?: string;
  dosageTypeId?: number;
  pushOnlyForget: boolean;
  information?: string;
  colorTypeId: number;
  medicationCategoryId: number;
};

export const saveMedicationRequest: MedsenseAPIRequestFactory<
  SaveMedicationRequest,
  Medication
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/medicaments' + (variables.id ? `/${variables.id}` : ''),
        method: variables.id ? 'PUT' : 'POST',
        sendBodyAs: 'form-data',
        body: {
          type: variables.scheduleType,
          name: variables.name,
          medication_type_id: `${variables.medicationTypeId}`,
          dosage: variables.dosage,
          dosage_type_id: variables.dosageTypeId
            ? `${variables.dosageTypeId}`
            : undefined,
          push_only_forget: variables.pushOnlyForget ? 1 : 0,
          information: variables.information ?? '',
          color_type_id: variables.colorTypeId,
          medicament_category_id: variables.medicationCategoryId,
        },
      };
    },
    parseResponse: parseMedication,
  };
};

type UpdateMedicationRequest = SaveMedicationRequest & {medicationId: number};

export const updateMedicationRequest: MedsenseAPIRequestFactory<
  UpdateMedicationRequest,
  Medication
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}`,
        method: 'PUT',
        sendBodyAs: 'json',
        body: {
          type: variables.scheduleType,
          name: variables.name,
          medication_type_id: `${variables.medicationTypeId}`,
          dosage: variables.dosage,
          dosage_type_id: variables.dosageTypeId
            ? `${variables.dosageTypeId}`
            : undefined,
          push_only_forget: variables.pushOnlyForget,
          information: variables.information,
          color_type_id: variables.colorTypeId,
          medicament_category_id: variables.medicationCategoryId,
        },
      };
    },
    parseResponse: parseMedication,
  };
};

/*
  Medication Taxonomies
*/

export const getColorTypesRequest: MedsenseAPIRequestFactory<
  void,
  ColorTypeModel[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/color-types',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseColorTypeModel);
    },
  };
};

export const getDosageTypesRequest: MedsenseAPIRequestFactory<
  void,
  DosageTypeModel[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/dosage-types',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseDosageTypeModel);
    },
  };
};

export const getMedicationTypesRequest: MedsenseAPIRequestFactory<
  void,
  MedicationTypeModel[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/medication-types',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseMedicationTypeModel);
    },
  };
};

export type DeleteMedicationRequest = {
  medicationId: number;
  shouldDeleteStatistics: boolean;
};

export const deleteMedicationRequest: MedsenseAPIRequestFactory<
  DeleteMedicationRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}?soft_delete=${0}`,
        method: 'DELETE',
      };
    },
    parseResponse(_response, _json) {
      return;
    },
  };
};

export type UploadMedicationPhotoRequest = {
  photoPath: string;
  medicationId: number;
};

export const uploadMedicationPhotoRequest: MedsenseAPIRequestFactory<
  UploadMedicationPhotoRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      let photoPath = variables.photoPath;

      const formData = new FormData();
      if (!photoPath.includes('private')) {
        photoPath = photoPath.replace('/var', '/private/var');
      }

      formData.append('Medicament[image]', {
        name: 'image.jpg',
        type: 'image/jpg',
        uri: photoPath,
      });

      return {
        endpoint: `/medicaments/${variables.medicationId}/load-image`,
        method: 'POST',
        sendBodyAs: 'multipart-form-data',
        body: formData,
      };
    },
    parseResponse() {},
  };
};

export type TakeNowRequest = {
  medicationId: number;
};

export const takeNowRequest: MedsenseAPIRequestFactory<
  TakeNowRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}/take`,
        method: 'POST',
      };
    },
    parseResponse(_response, _json) {
      return;
    },
  };
};
