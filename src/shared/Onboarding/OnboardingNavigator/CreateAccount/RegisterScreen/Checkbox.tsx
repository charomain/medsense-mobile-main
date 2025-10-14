import {useTheme} from '@app/contexts/theme';
import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

type CheckboxProps = {
  checked: boolean;
  onPress(): void;
};

export const Checkbox: React.FC<CheckboxProps> = ({checked, onPress}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.self,
        margin('vertical', 'p2'),
        {borderColor: theme.borderColor},
      ]}>
      {checked && (
        <View style={[styles.inner, {backgroundColor: theme.accentColor}]} />
      )}
    </Pressable>
  );
};

const SIZE = 18;
const INNER_SIZE = 12;

const styles = StyleSheet.create({
  self: {
    width: SIZE,
    height: SIZE,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    borderRadius: 4,
    width: INNER_SIZE,
    height: INNER_SIZE,
  },
});
