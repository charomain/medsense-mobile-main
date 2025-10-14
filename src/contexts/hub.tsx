import {createContext} from 'react';

export type HubSettings = {
  hasSetup: boolean;
  ignoreHubSetupCTA?: boolean;
};

export type IHubContext = {
  hubSettings: HubSettings | null;
  setHubSettings(hubSettings: HubSettings): void;
};

export const HubContext = createContext<IHubContext | undefined>(undefined);
