import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {AccessibleUserProfile} from '@app/models/profile';
import * as React from 'react';
import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';

type PendingPatientProps = {
  patient: AccessibleUserProfile;
  style: StyleProp<ViewStyle>;
  onAccept(patient: AccessibleUserProfile): void;
  onIgnore(patient: AccessibleUserProfile): void;
};

const copy = {
  careGiverRequest: 'Caregiver Request',
  wouldLikeToShareDataWithYou: 'would like to share data with you',
};

export const PendingPatient: React.FC<PendingPatientProps> = ({
  patient,
  style,
  onAccept,
  onIgnore,
}) => {
  const onPressAccept = useCallback(() => {
    onAccept(patient);
  }, [onAccept, patient]);

  const onPressIgnore = useCallback(() => {
    onIgnore(patient);
  }, [onIgnore, patient]);

  return (
    <Card style={style} flavor="contrast">
      <MedsenseText
        style={margin('bottom', 'p1')}
        flavor="contrast"
        size="h4"
        weight="bold">
        {copy.careGiverRequest}
      </MedsenseText>
      <MedsenseText flavor="muted" size="medium">
        {patient.email} {copy.wouldLikeToShareDataWithYou}
      </MedsenseText>
      <View style={[styles.buttonRow, margin('top', 'p3')]}>
        <MedsenseButton onPress={onPressAccept} style={margin('right', 'p2')}>
          Accept
        </MedsenseButton>
        <MedsenseButton onPress={onPressIgnore} outline={true}>
          Ignore
        </MedsenseButton>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
  },
});
