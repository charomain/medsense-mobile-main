import {AppConfig} from '../config';

export const getFullUploadUrl = (path: string): string => {
  return AppConfig.uploadsBaseUrl + path;
};

export const isDefined = <T>(x: T | null): x is T => {
  return !!x;
};

export const fixFilePath = (path: string): string => {
  if (path.startsWith('file://')) {
    return path;
  }

  if (path.startsWith('file:/')) {
    return 'file://' + path.substring(6);
  }

  return 'file://' + path;
};
