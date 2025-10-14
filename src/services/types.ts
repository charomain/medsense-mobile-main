export interface MedsenseAPIRequest<ParsedResponse> {
  createFetchRequest(): {
    endpoint: string;
    method: string;
    body?: unknown;
    sendBodyAs?: 'form-data' | 'form-data-2' | 'multipart-form-data' | 'json';
  };
  parseResponse(response: Response, json: unknown): ParsedResponse;
}

export type MedsenseAPIRequestFactory<RequestVariables, ParsedResponse> = ({
  variables,
}: {
  variables: RequestVariables;
}) => MedsenseAPIRequest<ParsedResponse>;

export class MedsenseAPIError extends Error {
  statusCode: number;
  responseBody: unknown;

  constructor(statusCode: number, responseBody: unknown) {
    super(`API Error (${statusCode})`);

    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export class MedsenseAPIParsingError extends Error {
  receivedBody: any;
  response: Response;

  constructor(requestName: string, receivedBody: any, response: Response) {
    super(`Unable to parse response for ${requestName}`);
    console.log('Failed response for ' + requestName, receivedBody);
    this.receivedBody = receivedBody;
    this.response = response;
  }
}
