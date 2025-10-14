import {useTheme} from '@app/contexts/theme';
import {MedsenseIcon} from '@app/components/Icon';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Pressable, StyleSheet} from 'react-native';

type EditButtonProps = {
  onPress(): void;
  style?: StyleProp<ViewStyle>;
};

export const EditButton: React.FC<EditButtonProps> = ({onPress, style}) => {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.self, style]}>
      <MedsenseIcon
        style={styles.icon}
        icon="edit"
        color={theme.screens.primary.textColor}
        size={{
          height: 16,
        }}
      />
      <MedsenseText size="sm">Edit</MedsenseText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  icon: {
    marginRight: 4,
  },
});
