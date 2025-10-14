import * as React from 'react';
import {EditProfileScreen} from '@app/shared/Account/AccountNavigator/EditProfileScreen';
import {ViewPatientStackScreenProps} from './types';
import {usePatientContext} from '@app/contexts/patient';

type PatientEditAccountScreenProps =
  ViewPatientStackScreenProps<'PatientEditAccount'>;

export const PatientEditAccount: React.FC<PatientEditAccountScreenProps> = ({
  navigation,
}) => {
  const patientProfile = usePatientContext();

  return (
    <EditProfileScreen
      currentProfile={patientProfile?.profile!}
      navigation={navigation}
      onPressChangePassword={null}
      onSaveProfile={patientProfile?.setPatientProfile!}
    />
  );
};
