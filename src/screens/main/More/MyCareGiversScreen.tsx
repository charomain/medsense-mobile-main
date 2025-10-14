import {CareGiversScreen} from '@app/shared/CarePortal/CareGiversScreen';
import * as React from 'react';
import {MoreStackScreenProps} from './types';
import {useCarePortalAPIForMe} from '@app/shared/CarePortal/hooks';

const copy = {
  heading: 'Caregivers',
  subtitle: 'Your Caregivers',
};

type MyCareGiversScreenProps = MoreStackScreenProps<'MyCareGivers'>;

export const MyCareGiversScreen: React.FC<MyCareGiversScreenProps> = ({
  navigation,
}) => {
  const onPressAdd = React.useCallback(() => {
    navigation.push('InviteCareGiverForMe');
  }, [navigation]);

  const carePortalAPI = useCarePortalAPIForMe();

  return (
    <CareGiversScreen
      onPressAdd={onPressAdd}
      title={copy.heading}
      subtitle={copy.subtitle}
      onPressBack={() => navigation.goBack()}
      {...carePortalAPI}
    />
  );
};
