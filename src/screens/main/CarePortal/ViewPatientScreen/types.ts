import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccessibleUserProfile} from '@app/models/profile';

export type ViewPatientStackParamList = {
  ViewPatientMenu: {profile: AccessibleUserProfile};
  PatientMedication: undefined;
  PatientInsights: undefined;
  PatientCareGivers: undefined;
  InviteCareGiverForPatient: undefined;
  PatientEditAccount: undefined;
};

export type ViewPatientStackScreenProps<
  ScreenName extends keyof ViewPatientStackParamList,
> = NativeStackScreenProps<ViewPatientStackParamList, ScreenName>;
