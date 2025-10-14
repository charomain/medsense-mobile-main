import {FC, PropsWithChildren} from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {HubContext, IHubContext, HubSettings} from '@app/contexts/hub';

const HUB_STORAGE_KEY = 'medsense_hub';

const hubStore = {
  async storeHubSettings(settings: HubSettings | null) {
    try {
      if (settings) {
        await AsyncStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(settings));
      } else {
        await AsyncStorage.removeItem(HUB_STORAGE_KEY);
      }
    } catch (e) {}
  },
  async getSettings(): Promise<HubSettings | null> {
    try {
      const value = await AsyncStorage.getItem(HUB_STORAGE_KEY);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as HubSettings;
    } catch {
      return null;
    }
  },
};

export const useHubSettings = (): IHubContext => {
  const ctx = React.useContext(HubContext);
  return ctx!;
};

export const HubSettingsProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [hubSettings, setHubSettings] = useState<HubSettings | null>(null);
  const onChangeHubSettings = useCallback(
    (newSettings: HubSettings) => {
      setHubSettings(newSettings);
      hubStore.storeHubSettings(newSettings);
    },
    [setHubSettings],
  );

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await hubStore.getSettings();
      setHubSettings(stored);
    };

    loadTheme();
  }, []);

  return (
    <HubContext.Provider
      value={{hubSettings, setHubSettings: onChangeHubSettings}}>
      {children}
    </HubContext.Provider>
  );
};
