import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccessibleUserProfile} from '@app/models/profile';

export type CarePortalStackParamList = {
  Landing: undefined;
  CreateAccount: undefined;
  ViewPatient: {profile: AccessibleUserProfile};
};

export type CarePortalStackScreenProps<
  ScreenName extends keyof CarePortalStackParamList,
> = NativeStackScreenProps<CarePortalStackParamList, ScreenName>;
