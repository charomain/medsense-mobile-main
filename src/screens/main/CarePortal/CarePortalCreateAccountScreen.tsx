import {CreateAccount} from '@app/shared/CarePortal/CreateAccount';
import * as React from 'react';
import {CarePortalStackScreenProps} from './types';

type CarePortalCreateAccountScreenProps =
  CarePortalStackScreenProps<'CreateAccount'>;

export const CarePortalCreateAccountScreen: React.FC<
  CarePortalCreateAccountScreenProps
> = ({navigation}) => {
  return <CreateAccount goBack={navigation.goBack} />;
};
