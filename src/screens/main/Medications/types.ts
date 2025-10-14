import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {AddMedicationStackParamList} from './AddMediction/types';
import {Medication} from '@app/models/medication';

export type MedicationListStackParamList = {
  MedicationList: undefined;
  AddMedication: NavigatorScreenParams<AddMedicationStackParamList>;
  TakeNow: {medication: Medication};
  ViewMedication: {medication: Medication};
};

export type MedicationListStackScreenProps<
  ScreenName extends keyof MedicationListStackParamList,
> = NativeStackScreenProps<MedicationListStackParamList, ScreenName>;
