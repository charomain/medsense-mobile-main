import {Layout} from '@app/appearance/layout';
import * as React from 'react';
import {buttonStyleForButtonProps, MedsenseButtonProps} from './Button';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme} from '@app/contexts/theme';
import {Colors} from '@app/appearance/colors';
import {MedsenseText} from './Text';
import {FontSizes} from '@app/appearance/fonts';

type IFloatingButton = React.FC<MedsenseButtonProps> & {
  Container: any;
};

export const FloatingButton: IFloatingButton = props => {
  const {children, onPress, outline, disabled} = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.self, buttonStyleForButtonProps(props, theme)]}>
      <MedsenseText
        style={[
          !outline && {
            color: theme.screens.primary.backgroundColor,
          },
          {
            fontSize: FontSizes.medium,
          },
        ]}>
        {children}
      </MedsenseText>
    </Pressable>
  );
};

const FloatingButtonContainer: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <View style={styles.container}>{children}</View>;
};

FloatingButton.Container = FloatingButtonContainer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Layout.standardSpacing.p2,
    bottom: Layout.standardSpacing.p2,
  },
  self: {
    paddingVertical: Layout.standardSpacing.p2,
    paddingHorizontal: Layout.standardSpacing.p2,
    borderRadius: Layout.buttonBorderRadius,
    alignItems: 'center',
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.4,
  },
});
