import * as React from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {FontSizes} from '@app/appearance/fonts';
import {Layout} from '@app/appearance/layout';
import {useTheme} from '@app/contexts/theme';
import {MedsenseText} from '../Text';

type ListToggleLabelProps = {
  label: string;
};

export const ListToggleLabel: React.FC<ListToggleLabelProps> = ({label}) => {
  const theme = useTheme();
  return (
    <MedsenseText
      style={[
        styles.labelStyle,
        {backgroundColor: theme.screens.primary.backgroundColor},
      ]}>
      {label}
    </MedsenseText>
  );
};

type ListToggleContainerProps = React.PropsWithChildren<{
  onPress(): void;
  style?: StyleProp<ViewStyle>;
}>;

export const ListToggleContainer: React.FC<
  ListToggleContainerProps
> = props => {
  const {onPress, style, children} = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.self, {borderColor: theme.input.borderColor}, style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: Layout.standardSpacing.p2,
    paddingHorizontal: Layout.standardSpacing.p2,
  },
  labelStyle: {
    position: 'absolute' as 'absolute',

    left: Layout.standardSpacing.p1 / 2,
    paddingHorizontal: Layout.standardSpacing.p1 / 2,
    top: -5,
    fontSize: FontSizes.sm,
  },
});
