import {useTheme} from '@app/contexts/theme';
import {Layout, margin, padding} from '@app/appearance/layout';
import * as React from 'react';
import {Pressable, StyleSheet} from 'react-native';

type ListToggleRowProps = React.PropsWithChildren<{
  onPress(): void;
  selected: boolean;
}>;

export const ListToggleRow: React.FC<ListToggleRowProps> = ({
  onPress,
  children,
  selected,
}) => {
  const theme = useTheme();
  const borderStyle = {
    borderColor: selected ? theme.accentColor : theme.input.borderColor,
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.self,
        borderStyle,
        padding('all', 'p2'),
        margin('bottom', 'p2'),
      ]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Layout.listGroupBorderRadius,
    alignItems: 'center',
  },
});
