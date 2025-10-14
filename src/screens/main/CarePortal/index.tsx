import * as React from 'react';
import {CarePortalLandingScreen} from './CarePortalLandingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CarePortalCreateAccountScreen} from './CarePortalCreateAccountScreen';
import {ViewPatientScreen} from './ViewPatientScreen';
import {CarePortalStackParamList} from './types';

export const CarePortalStack =
  createNativeStackNavigator<CarePortalStackParamList>();

export const CarePortalNavigator = () => {
  return (
    <CarePortalStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <CarePortalStack.Screen
        name="Landing"
        component={CarePortalLandingScreen}
      />
      <CarePortalStack.Screen
        name="CreateAccount"
        component={CarePortalCreateAccountScreen}
      />
      <CarePortalStack.Screen
        name="ViewPatient"
        component={ViewPatientScreen}
      />
    </CarePortalStack.Navigator>
  );
};
