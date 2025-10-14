import {MedsenseAPIParsingError, MedsenseAPIRequestFactory} from '../types';
import {parseGenericArray} from './utils';
import {ToothcaseProduct} from '@app/models/product';

const parseToothcaseProduct = (
  response: Response,
  json: any,
): ToothcaseProduct => {
  if ((json as any).id) {
    return {
      id: (json as any).id,
      code: (json as any).code,
      labels: (json as any).labels,
      thumbUrl: (json as any).thumb_url,
      linkUrl: (json as any).link_url,
    };
  }

  throw new MedsenseAPIParsingError('FetchToothcaseProducts', json, response);
};

export const fetchToothcaseProducts: MedsenseAPIRequestFactory<
  void,
  ToothcaseProduct[]
> = ({}) => {
  return {
    createFetchRequest() {
      return {
        endpoint: '/products',
        method: 'GET',
        sendBodyAs: 'json',
      };
    },
    parseResponse(response, json) {
      return parseGenericArray(response, json, parseToothcaseProduct);
    },
  };
};
