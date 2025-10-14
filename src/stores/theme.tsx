import {FC} from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {ThemeConfig, ThemeContext, ThemeMode} from '@app/contexts/theme';

const THEME_STORAGE_KEY = 'medsense_theme';

const themeStore = {
  async storeTheme(theme: ThemeMode | null) {
    try {
      if (theme) {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      } else {
        await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch (e) {}
  },
  async getTheme(): Promise<ThemeMode | null> {
    try {
      const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return value as ThemeMode | null;
    } catch {
      return null;
    }
  },
};

type ThemeProviderProps = React.PropsWithChildren<{
  lightTheme: ThemeConfig;
  darkTheme: ThemeConfig;
}>;

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  lightTheme,
  darkTheme,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode | null>(null);
  const onChangeTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeMode(newTheme);
      themeStore.storeTheme(newTheme);
    },
    [setThemeMode],
  );

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await themeStore.getTheme();
      setThemeMode(stored);
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{themeMode, setThemeMode: onChangeTheme, lightTheme, darkTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
