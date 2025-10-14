import {ClinicalProgram, UserProgramEnrollment} from '@app/models/program';
import {MedsenseAPIRequestFactory} from '../types';
import {parseGenericArray} from './utils';

const parseProgramResponse = (_resp: Response, json: any): ClinicalProgram => {
  const result: ClinicalProgram = {
    id: json.id,
    name: json.name,
    details: '',
  };

  return result;
};

export const fetchPrograms: MedsenseAPIRequestFactory<
  void,
  ClinicalProgram[]
> = ({}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/care-programs',
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseProgramResponse);
    },
  };
};

const parseUserProgramEnrollment = (
  repsonse: Response,
  json: any,
): UserProgramEnrollment => {
  const result: UserProgramEnrollment = {
    id: json.id,
    careProgramId: json.care_program_id,
    careProgram: parseProgramResponse(repsonse, json.care_program),
  };

  return result;
};

export const fetchUserPrograms: MedsenseAPIRequestFactory<
  void,
  UserProgramEnrollment[]
> = ({}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/care-programs/enrolled',
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseUserProgramEnrollment);
    },
  };
};

export const enrollInProgram: MedsenseAPIRequestFactory<{id: string}, void> = ({
  variables,
}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/care-programs/enroll',
        method: 'POST',
        sendBodyAs: 'json',
        body: {
          care_program_id: variables.id,
        },
      };
    },
    parseResponse() {
      return;
    },
  };
};
