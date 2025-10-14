import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type CreateAccountStackParamList = {
  RegisterScreen: undefined;
  GettingStartedScreen: {email: string};
  EnterPhoneScreen: {email: string};
  EnterNameScreen: {phone: string; email: string};
  OrganizationScreen: undefined;
  BirthdayScreen: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  FinishedScreen: undefined;
};

export type CreateAccountStackScreenProps<
  ScreenName extends keyof CreateAccountStackParamList,
> = NativeStackScreenProps<CreateAccountStackParamList, ScreenName>;
