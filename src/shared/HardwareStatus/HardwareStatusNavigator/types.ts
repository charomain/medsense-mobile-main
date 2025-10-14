import type {NativeStackScreenProps} from '@react-navigation/native-stack';
// import type {NavigatorScreenParams} from '@react-navigation/native';

export type HardwareStatusParamList = {
  Landing: undefined;
  HardwareSensorsList: undefined;
};

export type HardwareStatusScreenProps<
  ScreenName extends keyof HardwareStatusParamList,
> = NativeStackScreenProps<HardwareStatusParamList, ScreenName>;
