import {AccessibleUserProfile} from '@app/models/profile';
import {CarePortalLanding} from '@app/shared/CarePortal/CarePortalLanding';
import * as React from 'react';
import {CarePortalStackScreenProps} from './types';

type CarePortalLandingScreenProps = CarePortalStackScreenProps<'Landing'>;

export const CarePortalLandingScreen: React.FC<
  CarePortalLandingScreenProps
> = ({navigation}) => {
  const onPressCreateAccount = React.useCallback(() => {
    navigation.push('CreateAccount');
  }, [navigation]);

  const onPressProfile = React.useCallback(
    (profile: AccessibleUserProfile) => {
      navigation.push('ViewPatient', {
        profile,
      });
    },
    [navigation],
  );

  return (
    <CarePortalLanding
      onPressProfile={onPressProfile}
      onPressCreateAccount={onPressCreateAccount}
    />
  );
};
