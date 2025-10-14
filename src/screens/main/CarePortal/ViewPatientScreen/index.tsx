import * as React from 'react';
import {PatientContext, IPatientContext} from '@app/contexts/patient';
import {CarePortalStackScreenProps} from '../types';
import {PatientMenu} from './PatientMenu';
import {MedicationNavigator} from '../../Medications';
import {InsightsNavigator} from '@app/shared/Insights/InsightsNavigator';
import {PatientCareGiversScreen} from './PatientCareGivers';
import {InviteCareGiverForPatient} from './InviteCareGiverForPatient';
import {ViewPatientStackParamList, ViewPatientStackScreenProps} from './types';
import {useFetchProfile} from './hooks';
type ViewPatientScreenProps = CarePortalStackScreenProps<'ViewPatient'>;

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useCarePortalAPIForMe} from '@app/shared/CarePortal/hooks';
import {PatientEditAccount} from './PatientEditAccount';

export const PatientStack =
  createNativeStackNavigator<ViewPatientStackParamList>();

export const ViewPatientScreen: React.FC<ViewPatientScreenProps> = ({
  navigation,
  route,
}) => {
  const carePortalAPI = useCarePortalAPIForMe();
  const profileAPI = useFetchProfile(route.params.profile);

  const patientContext: IPatientContext = {
    patient: route.params.profile,
    refetchProfile: profileAPI.refetch,
    isLoadingProfile: profileAPI.loading,
    fullProfile: profileAPI.profile,
    setPatientProfile() {
      profileAPI.refetch();
    },
  };

  const removePatient = React.useCallback(() => {
    carePortalAPI.releaseAccessTo(route.params.profile);
    navigation.goBack();
  }, [navigation, carePortalAPI, route]);

  return (
    <PatientContext.Provider value={patientContext}>
      <PatientStack.Navigator screenOptions={{headerShown: false}}>
        <PatientStack.Screen name="ViewPatientMenu">
          {(props: ViewPatientStackScreenProps<'ViewPatientMenu'>) => (
            <PatientMenu {...props} removePatient={removePatient} />
          )}
        </PatientStack.Screen>
        <PatientStack.Screen
          name="PatientMedication"
          component={MedicationNavigator}
        />
        <PatientStack.Screen
          name="PatientInsights"
          component={InsightsNavigator}
        />
        <PatientStack.Screen
          name="PatientCareGivers"
          component={PatientCareGiversScreen}
        />
        <PatientStack.Screen
          name="InviteCareGiverForPatient"
          component={InviteCareGiverForPatient}
        />
        <PatientStack.Screen
          name="PatientEditAccount"
          component={PatientEditAccount}
        />
      </PatientStack.Navigator>
    </PatientContext.Provider>
  );
};
