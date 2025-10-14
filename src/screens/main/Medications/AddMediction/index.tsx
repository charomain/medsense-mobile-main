import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddMedicationQRScreen} from './AddMedicationQRScreen';
import {AddMedicationManualEntryScreen} from './AddMedicationManualEntryScreen';
import {AddMedicationScreen} from './AddMedicationScreen';
import {AddMedicationStackParamList} from './types';

const AddMedicationStack =
  createNativeStackNavigator<AddMedicationStackParamList>();

export const AddMedicationNavigator = () => {
  return (
    <AddMedicationStack.Navigator
      screenOptions={{
        headerTitle: 'Add Medication',
        headerShown: false,
      }}>
      <AddMedicationStack.Screen
        name="QRScan"
        component={AddMedicationQRScreen}
      />
      <AddMedicationStack.Screen
        name="ManualEntry"
        component={AddMedicationManualEntryScreen}
      />
      <AddMedicationStack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
      />
    </AddMedicationStack.Navigator>
  );
};
