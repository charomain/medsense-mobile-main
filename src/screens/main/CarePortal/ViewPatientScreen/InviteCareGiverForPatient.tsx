import {InviteCareGiverScreen} from '@app/shared/CarePortal/InviteCareGiverScreen';
import * as React from 'react';
import {ViewPatientStackScreenProps} from './types';
import {useCareGiverAPIForPatient} from './hooks';

type InviteCareGiverForPatientProps =
  ViewPatientStackScreenProps<'InviteCareGiverForPatient'>;

export const InviteCareGiverForPatient: React.FC<
  InviteCareGiverForPatientProps
> = ({navigation}) => {
  const carePortalAPI = useCareGiverAPIForPatient();

  return (
    <InviteCareGiverScreen goBack={navigation.goBack} {...carePortalAPI} />
  );
};
