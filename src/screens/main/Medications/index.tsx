import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddMedicationNavigator} from './AddMediction';
import {MedicationListScreen} from './MedicationListScreen';
import {ViewMedicationScreen} from './ViewMedicationScreen';
import {TakeNowScreen} from './TakeNowScreen';
import {MedicationListStackParamList} from './types';

const MedicationStack =
  createNativeStackNavigator<MedicationListStackParamList>();

export const MedicationNavigator = () => {
  return (
    <MedicationStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}>
      <MedicationStack.Screen
        name="MedicationList"
        component={MedicationListScreen}
      />
      <MedicationStack.Screen
        name="ViewMedication"
        component={ViewMedicationScreen}
        options={{
          title: 'View Medication',
        }}
      />
      <MedicationStack.Screen
        name="AddMedication"
        component={AddMedicationNavigator}
        options={{
          title: 'Add Medication',
        }}
      />
      <MedicationStack.Screen name="TakeNow" component={TakeNowScreen} />
    </MedicationStack.Navigator>
  );
};
