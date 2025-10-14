import {createContext} from 'react';

export type WifiSettings = {
  previousWifi: {
    ssid: string;
    password: string;
  };
};

export type IWifiContext = {
  wifiSettings: WifiSettings | null;
  setWifiSettings(hubSettings: WifiSettings): void;
};

export const WifiContext = createContext<IWifiContext | undefined>(undefined);
