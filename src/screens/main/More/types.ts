import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {NavigatorScreenParams} from '@react-navigation/native';
import type {AccountStackParamList} from '@app/shared/Account/AccountNavigator/types';

export type MoreStackParamList = {
  Menu: undefined;
  Account: NavigatorScreenParams<AccountStackParamList>;
  Notifications: undefined;
  MyCareGivers: undefined;
  Programs: undefined;
  InviteCareGiverForMe: undefined;
  PendingPatients: undefined;
  Hub: undefined;
  HardwareStatus: undefined;
  OrganizationEnrollment: undefined;
};

export type MoreStackScreenProps<ScreenName extends keyof MoreStackParamList> =
  NativeStackScreenProps<MoreStackParamList, ScreenName>;
