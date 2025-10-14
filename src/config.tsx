import {NativeModules} from 'react-native';
const {EnvironmentModule: EnvironmentModule} = NativeModules;
const constants = EnvironmentModule?.getConstants();

export const AppConfig = {
  apiUrl: constants?.apiUrl,
  // apiUrl: 'https://api.staging.medsense.health/api',
  uploadsBaseUrl: 'https://api.medsense.health',
};
