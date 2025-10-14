import {margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {AccessibleUserProfile} from '@app/models/profile';
import * as React from 'react';
import {View} from 'react-native';
import {PendingPatient} from './PendingPatient';

type PendingPatientsSectionProps = {
  patients: AccessibleUserProfile[] | undefined;
  onAccept(patient: AccessibleUserProfile): void;
  onIgnore(patient: AccessibleUserProfile): void;
};

const copy = {
  pendingPatients: 'Pending Actions',
};

export const PendingPatientsSection: React.FC<PendingPatientsSectionProps> = ({
  patients,
  onAccept,
  onIgnore,
}) => {
  if (!patients?.length) {
    return null;
  }

  return (
    <View style={margin('bottom', 'p2')}>
      <MedsenseText weight="bold" align="center" style={margin('bottom', 'p3')}>
        {copy.pendingPatients}
      </MedsenseText>
      {patients.map(p => (
        <PendingPatient
          onAccept={onAccept}
          onIgnore={onIgnore}
          style={margin('bottom', 'p2')}
          patient={p}
        />
      ))}
    </View>
  );
};
