import ImagePicker from 'react-native-image-crop-picker';
import {MedsenseAPIError, MedsenseAPIParsingError} from '../types';
import {format} from 'date-fns';

export const parseGenericArray = <T>(
  response: Response,
  json: any,
  parser: (response: Response, json: any) => T,
): T[] => {
  if (Array.isArray(json)) {
    return json.map(row => parser(response, row));
  }

  throw new MedsenseAPIParsingError('ArrayParsingFailed', json, response);
};

export const parseNullable = <T>(
  response: Response,
  json: any,
  parser: (response: Response, json: any) => T,
): T | null => {
  if (!json) {
    return null;
  } else {
    return parser(response, json);
  }
};

export const parseDate = (response: Response, json: any, key: string): Date => {
  const value = json[key];
  if (!value) {
    throw new MedsenseAPIParsingError(
      'DateParsingFailed: ' + key,
      json,
      response,
    );
  }

  if (value.length === 10) {
    const parts = value.split('-');
    if (parts.length !== 3) {
      throw new MedsenseAPIParsingError('DateParsingFailed', json, response);
    }

    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }

  const coerced = new Date(value);
  if (!isNaN(coerced.getTime())) {
    return coerced;
  }

  throw new MedsenseAPIParsingError('DateParsingFailed', json, response);
};

export const parseTime = (response: Response, json: any, key: string): Date => {
  const value: string = json[key];
  if (value && value.length === 8) {
    const [hours, minutes, seconds] = value.split(':').map(p => Number(p));
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }

  throw new MedsenseAPIParsingError('TimeParsingFailed', json, response);
};

export const formatDateForServer = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const formatTimeForServer = (date: Date) => {
  return format(date, 'HH:mm');
};

export const resizePhoto = async (
  filePath: string,
  maxWidth: number,
  maxHeight: number,
) => {
  try {
    const result = await ImagePicker.openCropper({
      path: filePath, // Input image path
      width: maxWidth, // Target width
      height: maxHeight, // Target height
      compressImageQuality: 0.9, // 90% quality, matching original
      compressImageMaxWidth: maxWidth,
      compressImageMaxHeight: maxHeight,
      freeStyleCropEnabled: false, // Disable cropping UI
      forceJpg: true, // Ensure JPEG output
      includeExif: false, // Exclude EXIF data for consistency
      mediaType: 'photo',
    });

    return {
      uri: result.path, // Matches ImageResizer output
      width: result.width,
      height: result.height,
      size: result.size,
      mime: result.mime,
      name: result.path.split('/').pop(), // Derive filename for compatibility
    };
  } catch (error) {
    throw new Error(`Image resizing failed: ${error.message}`);
  }
};

type APIErrorResponse = {
  status: number;
  message: string;
};

const DEFAULT_MESSAGE = 'Sorry, something went wrong. Try a little later.';

export const parseAPIErrorMessage = (error: MedsenseAPIError): string => {
  const responseBody = error?.responseBody;
  console.log('err', responseBody);

  let genericAPIError = responseBody as APIErrorResponse;
  if (genericAPIError.message !== undefined) {
    return genericAPIError.message;
  }

  // Try parsing
  const possibleError = Object.values(responseBody as any).map(message =>
    Array.isArray(message) ? message.join(' ') : `${message}`,
  );
  if (possibleError.length) {
    return possibleError.join(' ');
  }

  return DEFAULT_MESSAGE;
};