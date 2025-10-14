import {createContext} from 'react';
import {StatusBarStyle, StyleProp, ViewStyle} from 'react-native';
import {useColorScheme} from 'react-native';
import {useCallback} from 'react';
import {useContext} from 'react';

export type ThemeMode = 'light' | 'dark';

export type ThemeConfig = {
  statusBarStyle: StatusBarStyle;
  accentColor: string;
  dangerColor: string;
  dangerLightColor: string;
  borderColor: string;
  mutedColor: string;
  logoTextColor: string;
  logoIconName: 'toothcase' | 'logo-dark';
  input: {
    borderColor: string;
    placeholderColor: string;
    textColor: string;
  };
  screens: {
    primary: {
      backgroundColor: string;
      textColor: string;
      textMutedColor: string;
      shadowColor: string;
      slightBackgroundContrastColor: string;
    };
    contrast: {
      backgroundColor: string;
      textColor: string;
      textMutedColor: string;
      shadowColor: string;
      slightBackgroundContrastColor: string;
    };
  };
};

export type Theme = ThemeConfig & {
  bottomBorderStyle(): StyleProp<ViewStyle>;
};

export type IThemeContext = {
  lightTheme: ThemeConfig;
  darkTheme: ThemeConfig;
  themeMode: ThemeMode | null;
  setThemeMode(theme: ThemeMode): void;
};

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = (): Theme => {
  const themeContext = useContext(ThemeContext);
  const isSystemDarkMode = useColorScheme() === 'dark';
  const isDarkMode = themeContext?.themeMode === 'dark' || isSystemDarkMode;
  const themePreset = isDarkMode
    ? themeContext!.darkTheme
    : themeContext!.lightTheme;

  const bottomBorderStyle: Theme['bottomBorderStyle'] = useCallback(() => {
    return {
      borderBottomWidth: 1,
      borderBottomColor: themePreset.borderColor,
    };
  }, [themePreset]);

  return {
    ...themePreset,
    bottomBorderStyle,
  };
};
