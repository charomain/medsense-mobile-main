import {InviteCareGiverScreen} from '@app/shared/CarePortal/InviteCareGiverScreen';
import * as React from 'react';
import {MoreStackScreenProps} from './types';
import {useCarePortalAPIForMe} from '@app/shared/CarePortal/hooks';

type InviteCareGiverForMeProps = MoreStackScreenProps<'InviteCareGiverForMe'>;

export const InviteCareGiverForMe: React.FC<InviteCareGiverForMeProps> = ({
  navigation,
}) => {
  const carePortalAPI = useCarePortalAPIForMe();

  return (
    <InviteCareGiverScreen goBack={navigation.goBack} {...carePortalAPI} />
  );
};
