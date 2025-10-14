import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {AccessibleUserProfile} from '@app/models/profile';
import {Card} from '@app/components/Card';
import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import {ViewProfileButton} from './ViewProfileButton';
import type {StyleProp, ViewStyle} from 'react-native';

type CarePortalProfileRowProps = {
  item: AccessibleUserProfile;
  onPress(item: AccessibleUserProfile): void;
  style: StyleProp<ViewStyle>;
};

const InitialsCircle: React.FC<{name: string}> = ({name}) => {
  const theme = useTheme();

  return (
    <View style={[styles.initials, {backgroundColor: theme.accentColor}]}>
      <MedsenseText size="h3" style={{color: theme.screens.contrast.textColor}}>
        {name}
      </MedsenseText>
    </View>
  );
};

const copy = {
  patient: 'Patient',
};

export const CarePortalProfileRow: React.FC<CarePortalProfileRowProps> = ({
  item,
  onPress,
  style,
}) => {
  const onPressProfile = React.useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <Card onPress={onPressProfile} style={style} flavor="contrast">
      <View style={styles.row}>
        <InitialsCircle name={item.email.substring(0, 1)} />
        <View style={styles.text}>
          <MedsenseText flavor="contrast">{item.email}</MedsenseText>
          <MedsenseText style={margin('top', 'p1')} size="sm" flavor="muted">
            {copy.patient}
          </MedsenseText>
        </View>
      </View>
      <View style={margin('top', 'p3')}>
        <ViewProfileButton />
      </View>
    </Card>
  );
};

const SIZE = 50;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  initials: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.standardSpacing.p2,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
