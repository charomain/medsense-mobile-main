import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import {Theme} from '@app/contexts/theme';
import * as React from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {MedsenseText} from './Text';

export type MedsenseButtonProps = React.PropsWithChildren<{
  onPress?(): void;
  flavor?: 'danger' | 'accent';
  outline?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  size?: 'sm-1';
}>;

export const buttonStyleForButtonProps = (
  props: MedsenseButtonProps,
  theme: Theme,
): StyleProp<ViewStyle> => {
  const {style, flavor, outline, disabled} = props;
  const primaryColorForState = disabled
    ? theme.mutedColor
    : flavor === 'danger'
    ? theme.dangerColor
    : theme.accentColor;

  return [
    outline && styles.outline,
    outline
      ? {
          borderColor: primaryColorForState,
        }
      : {
          backgroundColor: primaryColorForState,
        },
    style,
  ];
};

export const MedsenseButton: React.FC<MedsenseButtonProps> = props => {
  const {children, onPress, outline, disabled, size, flavor} = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.self, buttonStyleForButtonProps(props, theme)]}>
      <MedsenseText
        size={size === 'sm-1' ? 'sm' : undefined}
        style={[
          !outline && {
            color: theme.screens.primary.backgroundColor,
          },
          flavor === 'danger' &&
            outline && {
              color: theme.dangerColor,
            },
          (flavor === 'accent' || !flavor) &&
            outline && {
              color: theme.accentColor,
            },
        ]}>
        {children}
      </MedsenseText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: Layout.buttonBorderRadius,
    alignItems: 'center',
  },
  outline: {
    borderWidth: 1,
  },
});
