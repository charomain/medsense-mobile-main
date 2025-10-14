import {getTimeZone} from '@app/models/profile';
import {MedsenseAPIRequestFactory} from '../types';
import {MedsenseAPIParsingError} from '../types';

type LoginVariables = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export const loginRequest: MedsenseAPIRequestFactory<
  LoginVariables,
  LoginResponse
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/auth/login',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          username: variables.email,
          password: variables.password,
        },
      };
    },
    parseResponse(response, json) {
      if ((json as LoginResponse)?.token) {
        return {
          token: (json as LoginResponse).token,
        };
      }

      throw new MedsenseAPIParsingError('Login', json, response);
    },
  };
};

type RegisterVariables = {
  email: string;
  password: string;
};

export const registerRequest: MedsenseAPIRequestFactory<
  RegisterVariables,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      const timezone = getTimeZone();

      return {
        endpoint: '/auth/sign-up',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          username: variables.email,
          password: variables.password,
          timezone,
        },
      };
    },
    parseResponse() {
      return;
    },
  };
};

type ForgotPasswordVariables = {
  email: string;
};

export const forgotPasswordRequest: MedsenseAPIRequestFactory<
  ForgotPasswordVariables,
  void
> = ({variables}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/auth/recover-password',
        method: 'POST',
        sendBodyAs: 'form-data',
        body: {
          username: variables.email,
        },
      };
    },
    parseResponse() {
      return;
    },
  };
};
