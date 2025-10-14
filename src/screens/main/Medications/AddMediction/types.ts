import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AddMedicationStackParamList = {
  QRScan: undefined;
  ManualEntry: undefined;
  AddMedication: undefined;
};

export type AddMedicationStackScreenProps<
  ScreenName extends keyof AddMedicationStackParamList,
> = NativeStackScreenProps<AddMedicationStackParamList, ScreenName>;
