import 'url-search-params-polyfill';
import {
  MedsenseAPIRequestFactory,
  MedsenseAPIRequest,
  MedsenseAPIError,
} from '../types';
import {secureSessionStorage} from '@app/stores/session';
import {useSignOut} from '@app/stores/auth';
import {useCallback, useContext, useMemo, useState} from 'react';
import {Platform} from 'react-native';
import {PatientContext} from '@app/contexts/patient';
import {AppTenant, TenantContext} from '@app/contexts/tenant';
import {AppConfig} from '../../config';
import {showErrorAlert} from '@app/shared/utils';
import axios, {AxiosRequestConfig, AxiosError} from 'axios';

const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError;
};

const apiURL = AppConfig.apiUrl;

const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 30000,
  headers: {
    'X-Platform': Platform.OS,
  },
});

class MedsenseAPI {
  async makeRequest<ParsedResponse>(
    token: string | undefined,
    tenant: AppTenant | undefined,
    request: MedsenseAPIRequest<ParsedResponse>,
    onAuthError: () => void,
  ): Promise<ParsedResponse> {
    try {
      const headers: RequestInit['headers'] = {};
      if (tenant === 'toothcase') {
        headers['x-medsense-tenant'] = 'toothcase';
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fetchOptions = request.createFetchRequest();
      let body: URLSearchParams | FormData | string | undefined;
      // let transformRequest: AxiosRequestConfig['transformRequest'] | undefined;
      if (fetchOptions.body) {
        if (fetchOptions.sendBodyAs === 'multipart-form-data') {
          headers['Content-type'] = 'multipart/form-data';
          // headers['Content-length'] = (fetchOptions.body as FormData).;
          body = fetchOptions.body as any;
        } else if (fetchOptions.sendBodyAs === 'form-data') {
          headers['Content-type'] = 'application/x-www-form-urlencoded';
          // console.log(
          //   'FORM BODY',
          //   Object.entries(fetchOptions.body)
          //     .reduce((fd, [key, value]) => {
          //       fd.push(`${key}:${value}`);
          //       return fd;
          //     }, [] as string[])
          //     .join('\n'),
          // );
          body = Object.entries(fetchOptions.body)
            .reduce((fd, [key, value]) => {
              fd.append(key, `${value}`);
              return fd;
            }, new URLSearchParams())
            .toString();
        } else {
          headers['Content-type'] = 'application/json';
          body = JSON.stringify(fetchOptions.body);
        }
      }

      const config: AxiosRequestConfig = {
        method: fetchOptions.method,
        url: fetchOptions.endpoint,
        responseType: 'json',
        headers,
        data: body,
      };

      console.log('Request: ', config);

      // send post request and get response
      const response = await axiosInstance.request(config);
      return request.parseResponse(response as any, response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          onAuthError();
        } else if (error.response) {
          throw new MedsenseAPIError(
            error.response.status,
            error.response.data,
          );
        }
      }

      console.error(error);
      // TODO: Add error parsing
      throw error;
    }
  }
}

const apiManager = new MedsenseAPI();

type FetchFunction<RequestVariables, ParsedResponse> = (requestOptions: {
  variables: RequestVariables;
  tokenOverride?: string;
}) => Promise<ParsedResponse>;

export const useMedsenseAPIRequest = <RequestVariables, ParsedResponse>(
  apiRequestFactory: MedsenseAPIRequestFactory<
    RequestVariables,
    ParsedResponse
  >,
): FetchFunction<RequestVariables, ParsedResponse> => {
  const signOut = useSignOut();
  const patientContext = useContext(PatientContext);
  const tenantContext = useContext(TenantContext);
  const tenant = useMemo(() => tenantContext?.tenant, [tenantContext]);

  const makeReq: FetchFunction<RequestVariables, ParsedResponse> = useCallback(
    async ({variables, tokenOverride}) => {
      const request = apiRequestFactory({variables});
      let token: string | undefined;
      if (tokenOverride) {
        token = tokenOverride;
      } else if (patientContext) {
        token = patientContext.patient.token!;
      } else {
        const session = await secureSessionStorage.getSession('master');
        token = session?.accessToken;
      }

      return apiManager.makeRequest<ParsedResponse>(
        token,
        tenant,
        request,
        () => {
          signOut();
        },
      );
    },
    [apiRequestFactory, signOut, tenant, patientContext],
  );

  return makeReq;
};

type WrappedMedsenseAPIRequest<RequestVariables, ParsedResponse> = {
  request(variables: RequestVariables, tokenOverride?: string): void;
  loading: boolean;
  error?: Error;
  response?: ParsedResponse;
};

export const useWrappedMedsenseAPIRequest = <RequestVariables, ParsedResponse>(
  apiRequestFactory: MedsenseAPIRequestFactory<
    RequestVariables,
    ParsedResponse
  >,
  onSuccess: ((data: ParsedResponse) => void) | undefined = undefined,
): WrappedMedsenseAPIRequest<RequestVariables, ParsedResponse> => {
  const executeRequest = useMedsenseAPIRequest(apiRequestFactory);
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState<
    ParsedResponse | undefined
  >(undefined);

  const [error, setError] = useState<Error | undefined>(undefined);
  const request = useCallback(
    async (variables: RequestVariables, tokenOverride?: string) => {
      setLoading(true);
      try {
        const response = await executeRequest({variables, tokenOverride});
        onSuccess && onSuccess(response);
        setParsedResponse(response);
      } catch (e) {
        console.log('GOT AN ERROR', e);
        showErrorAlert(e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [executeRequest, setLoading, setError, onSuccess],
  );

  return {
    loading,
    error,
    request,
    response: parsedResponse,
  };
};
