import {FC, PropsWithChildren} from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useEffect} from 'react';
import {IWifiContext, WifiContext, WifiSettings} from '@app/contexts/wifi';

const WIFI_ASYNC_STORAGE_KEY = 'medsense_wifi';
const WIFI_ENCRYPED_STORAGE_KEY = 'medsense_wifi';

const wifiStore = {
  async storeWifiSettings(settings: WifiSettings | null) {
    try {
      if (settings) {
        await AsyncStorage.setItem(
          WIFI_ASYNC_STORAGE_KEY,
          settings.previousWifi.ssid,
        );
        await EncryptedStorage.setItem(
          WIFI_ENCRYPED_STORAGE_KEY,
          settings.previousWifi.password,
        );
      } else {
        await AsyncStorage.removeItem(WIFI_ASYNC_STORAGE_KEY);
        await EncryptedStorage.removeItem(WIFI_ENCRYPED_STORAGE_KEY);
      }
    } catch (e) {}
  },
  async getSettings(): Promise<WifiSettings | null> {
    try {
      const ssid = await AsyncStorage.getItem(WIFI_ASYNC_STORAGE_KEY);
      const password = await EncryptedStorage.getItem(
        WIFI_ENCRYPED_STORAGE_KEY,
      );
      if (!ssid || !password) {
        return null;
      }

      return {
        previousWifi: {
          ssid,
          password,
        },
      };
    } catch {
      return null;
    }
  },
};

export const useWifiSettings = (): IWifiContext => {
  const ctx = React.useContext(WifiContext);
  return ctx!;
};

export const WifiSettingsProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [wifiSettings, setWifiSettings] = useState<WifiSettings | null>(null);
  const onChangeWifiSettings = useCallback(
    (newSettings: WifiSettings) => {
      setWifiSettings(newSettings);
      wifiStore.storeWifiSettings(newSettings);
    },
    [setWifiSettings],
  );

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await wifiStore.getSettings();
      setWifiSettings(stored);
    };

    loadTheme();
  }, []);

  return (
    <WifiContext.Provider
      value={{wifiSettings, setWifiSettings: onChangeWifiSettings}}>
      {children}
    </WifiContext.Provider>
  );
};
