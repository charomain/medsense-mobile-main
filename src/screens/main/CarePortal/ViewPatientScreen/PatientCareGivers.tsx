import {CareGiversScreen} from '@app/shared/CarePortal/CareGiversScreen';
import * as React from 'react';
import {ViewPatientStackScreenProps} from './types';
import {useCareGiverAPIForPatient} from './hooks';
import {usePatientContext} from '@app/contexts/patient';
import {nameWithLastInitial} from '@app/models/profile';

type PatientCareGiversScreenProps =
  ViewPatientStackScreenProps<'PatientCareGivers'>;

export const PatientCareGiversScreen: React.FC<
  PatientCareGiversScreenProps
> = ({navigation}) => {
  const onPressAdd = React.useCallback(() => {
    navigation.push('InviteCareGiverForPatient');
  }, [navigation]);

  const patientContext = usePatientContext();
  const carePortalAPI = useCareGiverAPIForPatient();

  return (
    <CareGiversScreen
      title={`${nameWithLastInitial(patientContext?.profile)} `}
      subtitle="Caregivers"
      onPressAdd={onPressAdd}
      onPressBack={() => navigation.goBack()}
      {...carePortalAPI}
    />
  );
};
