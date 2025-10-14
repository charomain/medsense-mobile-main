import type {NativeStackScreenProps} from '@react-navigation/native-stack';
// import type {NavigatorScreenParams} from '@react-navigation/native';

export type HubStackParamList = {
  Intro: undefined;
  CellHubSetup: undefined;
  PlugInHubSetup: undefined;
  HomeWifiConfirmation: undefined;
  HomeWifiPassword: {homeWifiName: string};
  HubSetup: {homeWifiName: string; homeWifiPassword: string};
  HubSetupConfirmComplete: {homeWifiName: string; homeWifiPassword: string};
  HubSetupComplete: {homeWifiName: string; homeWifiPassword: string};
};

export type HubStackScreenProps<ScreenName extends keyof HubStackParamList> =
  NativeStackScreenProps<HubStackParamList, ScreenName>;
