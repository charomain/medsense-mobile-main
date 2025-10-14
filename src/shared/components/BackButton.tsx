import {useTheme} from '@app/contexts/theme';
import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MedsenseIcon} from './Icon';
import {MedsenseText} from './Text';

type BackButtonProps = {
  onPress(): void;
};

export const BACK_BUTTON_WIDTH = 70;

export const BackButtonBuffer = () => (
  <View style={{width: BACK_BUTTON_WIDTH}} />
);

export const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.self}>
      <MedsenseIcon
        icon="left-chevron"
        size={{height: 18}}
        color={theme.accentColor}
      />
      <MedsenseText flavor="muted" style={margin('left', 'p1')}>
        Back
      </MedsenseText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    width: BACK_BUTTON_WIDTH,
  },
});
