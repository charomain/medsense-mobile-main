import {MedsenseButton} from '@app/components/Button';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {View} from 'react-native';
import {AccessibleUserProfile} from '@app/models/profile';
import {Card} from '@app/components/Card';
import {margin, padding} from '@app/appearance/layout';

type CarePortalRowProps = {
  item: AccessibleUserProfile;
  stopSharing(item: AccessibleUserProfile): void;
  resendRequest(item: AccessibleUserProfile): void;
};

const copy = {
  pendingInvite: 'Pending Invite',
  activeCareGiver: 'Active Caregiver',

  btns: {
    removeCareGiver: 'Remove Caregiver',
    resendInvite: 'Resend Invite',
  },
};

export const CarePortalRowForParent: React.FC<CarePortalRowProps> = ({
  item,
  stopSharing,
  resendRequest,
}) => {
  return (
    <Card>
      <View style={padding('horizontal', 'p2')}>
        <MedsenseText size="h3">{item.email}</MedsenseText>
        <MedsenseText
          style={margin('top', 'p1')}
          flavor={item.isConfirmed ? 'accent' : 'muted'}>
          {item.isConfirmed ? copy.activeCareGiver : copy.pendingInvite}
        </MedsenseText>
      </View>
      <View style={margin('top', 'p3')}>
        {!item.isConfirmed && (
          <MedsenseButton
            style={margin('bottom', 'p2')}
            onPress={() => resendRequest(item)}>
            {copy.btns.resendInvite}
          </MedsenseButton>
        )}
        <MedsenseButton outline={true} onPress={() => stopSharing(item)}>
          {copy.btns.removeCareGiver}
        </MedsenseButton>
      </View>
    </Card>
  );
};

// const styles = StyleSheet.create({});
