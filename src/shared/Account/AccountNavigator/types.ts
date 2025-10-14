import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AccountStackParamList = {
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type AccountStackScreenProps<
  ScreenName extends keyof AccountStackParamList,
> = NativeStackScreenProps<AccountStackParamList, ScreenName>;
