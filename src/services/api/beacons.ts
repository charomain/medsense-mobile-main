import {MedsenseAPIRequestFactory} from '../types';
import {MedsenseAPIParsingError} from '../types';
import {parseGenericArray} from './utils';
import {FreeBeaconExpanded, Hub, FreeBeaconModel} from '@app/models/beacon';

export type AddBeaconRequestBody =
  | {
      qrcode: string;
    }
  | {
      ident: string;
    };

export type AddedBeacon = {
  beaconId: number;
  name: string;
  uuid: string;
  colorTypeId: number;
  weeklyBeaconSetId: number;
  used?: boolean;
};

const parseAddedBeacon = (response: Response, json: any): AddedBeacon => {
  if ((json as any).uuid) {
    return {
      beaconId: (json as any).id,
      name: (json as any).name,
      uuid: (json as any).uuid,
      colorTypeId: (json as any).color_type_id,
      weeklyBeaconSetId: (json as any).weekly_beacon_set_id,
      used: (json as any).used,
    };
  }

  throw new MedsenseAPIParsingError('AddBeaconRequest', json, response);
};

export const addBeaconRequest: MedsenseAPIRequestFactory<
  AddBeaconRequestBody,
  AddedBeacon[]
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/free-beacons',
        method: 'POST',
        body: variables,
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseAddedBeacon);
    },
  };
};

type AssignBeaconRequest = {
  medicationId: number;
  beaconName: string;
  beaconCode: string;
};

export const assignBeaconRequest: MedsenseAPIRequestFactory<
  AssignBeaconRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/medicaments/${variables.medicationId}/assign-beacon`,
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          name: variables.beaconName,
          code: variables.beaconCode,
        },
      };
    },
    parseResponse(_response, _json) {},
  };
};

type AssignWeeklyBeaconRequestRequest = {
  medicationId: number;
  beacons: Array<{
    beaconName: string;
    beaconCode: string;
  }>;
};

export const assignWeeklyBeaconRequest: MedsenseAPIRequestFactory<
  AssignWeeklyBeaconRequestRequest,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: `/weekly-beacons/${variables.medicationId}/bunch`,
        method: 'POST',
        sendBodyAs: 'json',
        body: variables.beacons.map(b => ({
          name: b.beaconName,
          code: b.beaconCode,
        })),
      };
    },
    parseResponse(_response, _json) {},
  };
};

const parseFreeBeacon = (_response: Response, json: any) => {
  return {
    beaconId: json.id,
    name: json.name,
    uuid: json.uuid,
    colorTypeId: json.color_type_id,
    weeklyBeaconSetId: json.weekly_beacon_set_id ?? null,
    used: json.used ?? null,
  };
};

export const getBeaconsRequest: MedsenseAPIRequestFactory<
  void,
  FreeBeaconModel[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/free-beacons',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseFreeBeacon);
    },
  };
};

export const getFreeWeeklyBeaconsRequest: MedsenseAPIRequestFactory<
  void,
  FreeBeaconModel[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/free-weekly-beacons',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseFreeBeacon);
    },
  };
};

const parseBeaconDeviceDetails = (
  _response: Response,
  json: any,
): FreeBeaconExpanded['device'] => {
  return {
    uuid: json.uuid,
    ipAddress: json.ip_address,
    messageVersion: json.message_version,
    sensorName: json.sensor_name,
    battery: json.battery,
    broadcastChannel: json.broadcast_channelm,
    signalStrength: json.signal_strength,
    x: json.x,
    y: json.y,
    z: json.z,
    delta: json.delta,
    createdAt: new Date(json.created_at),
    updatedAt: new Date(json.updated_at),
  };
};

const parseFreeBeaconExtended = (
  response: Response,
  json: any,
): FreeBeaconExpanded => {
  return {
    id: json.id,
    userId: json.user_id,
    uuid: json.uuid,
    name: json.name,
    colorTypeId: json.color_type_id,
    status: json.status,
    created: json.created,
    colorType: json.color_type,
    device: json.device
      ? parseBeaconDeviceDetails(response, json.device)
      : null,
    alert: json.alert,
  };
};

export const getBeaconsStatus: MedsenseAPIRequestFactory<
  void,
  FreeBeaconExpanded[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/free-beacons/status',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseFreeBeaconExtended);
    },
  };
};

const parseHub = (response: Response, json: any): Hub => {
  return {
    deviceName: json.device_name,
    ipAddress: json.ip_address,
    hardwareVersion: json.hardware_version,
    bootCount: json.boot_count,
    beaconCount: json.beacon_count,
    timeFromCurrent: json.time_from_current,
    timeFromLastSend: json.time_from_last_send,
    softwareVersion: json.software_version,
    lastBeaconUuid: json.last_beacon_uuid,
    alert: json.alert,
  };
};

export const getHubStatus: MedsenseAPIRequestFactory<void, Hub[]> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/gateways',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseHub);
    },
  };
};

export type BeaconSetBeacon = {
  id: number;
  uuid: string;
  name: string;
  day: string;
};

const parseBeaconSetBeacon = (
  response: Response,
  json: any,
): BeaconSetBeacon => {
  return {
    id: json.id,
    uuid: json.uuid,
    name: json.name,
    day: json.day,
  };
};

export type BeaconSet = {
  id: number;
  name: string;
  beacons: BeaconSetBeacon[];
};

const parseBeaconSet = (response: Response, json: any): BeaconSet => {
  return {
    id: json.id,
    name: json.name,
    beacons:
      json.free_weekly_beacons?.map((b: unknown) =>
        parseBeaconSetBeacon(response, b),
      ) ?? [],
  };
};

export const getBeaconSets: MedsenseAPIRequestFactory<
  void,
  BeaconSet[]
> = () => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/beacon-sets',
        method: 'GET',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseBeaconSet);
    },
  };
};
