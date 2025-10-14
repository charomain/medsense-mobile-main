import {Colors} from './colors';
import {ThemeConfig} from '@app/contexts/theme';

const darkScreenConfig: ThemeConfig['screens']['primary'] = {
  backgroundColor: Colors.dark,
  textColor: Colors.light,
  textMutedColor: '#bbb',
  shadowColor: '#676767',
  slightBackgroundContrastColor: 'rgba(255, 255, 255, 0.05)',
};

const lightScreenConfig: ThemeConfig['screens']['primary'] = {
  backgroundColor: Colors.light,
  textColor: Colors.dark,
  textMutedColor: Colors.darkSpaces250,
  shadowColor: '#676767',
  slightBackgroundContrastColor: 'rgba(0, 0, 0, 0.05)',
};

export const lightTheme: ThemeConfig = {
  statusBarStyle: 'dark-content',
  accentColor: Colors.turquoise,
  dangerColor: Colors.red,
  dangerLightColor: Colors.redLight,
  mutedColor: '#565656',
  borderColor: Colors.lightBloomLightBloom,
  logoTextColor: '#565656',
  logoIconName: 'logo-dark',
  input: {
    borderColor: '#565656',
    placeholderColor: '#565656',
    textColor: '#000',
  },
  screens: {
    primary: lightScreenConfig,
    contrast: darkScreenConfig,
  },
};

export const darkTheme: ThemeConfig = {
  statusBarStyle: 'dark-content',
  accentColor: Colors.turquoise,
  dangerColor: Colors.red,
  dangerLightColor: Colors.redLight,
  borderColor: Colors.lightBloomLightBloom,
  logoTextColor: '#fff',
  mutedColor: '#565656',
  logoIconName: 'logo-dark',
  input: {
    borderColor: '#ccc',
    placeholderColor: '#ccc',
    textColor: '#fff',
  },
  screens: {
    primary: darkScreenConfig,
    contrast: lightScreenConfig,
  },
};
