import {parseAPIErrorMessage} from '@app/services/api/utils';
import {MedsenseAPIError} from '@app/services/types';
import {Alert} from 'react-native';

export const showErrorAlert = (e: unknown) => {
  const message =
    e instanceof MedsenseAPIError
      ? parseAPIErrorMessage(e)
      : (e as Error).message;
  Alert.alert('Error', message);
};

/*
  Parses a string in format YYYY-MM-DD
  in the user local timezone
*/
export const parseServerDateString = (dateString: string): Date => {
  const [year, month, date] = dateString.split('-').map(p => parseInt(p, 10));
  return new Date(year, month - 1, date);
};
