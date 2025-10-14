import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type OnboardingStackParamList = {
  Splash: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackScreenProps<
  ScreenName extends keyof OnboardingStackParamList,
> = NativeStackScreenProps<OnboardingStackParamList, ScreenName>;
