import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Pressable, StyleSheet, View} from 'react-native';
import {MedsenseIcon} from './Icon';
import {MedsenseText} from './Text';

type DashedBorderedButtonProps = {
  onPress(): void;
  title: string;
  style?: StyleProp<ViewStyle>;
};

export const DashedBorderedButton: React.FC<DashedBorderedButtonProps> = ({
  onPress,
  title,
  style,
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.self, {borderColor: theme.accentColor}, style]}>
      <View
        style={[
          styles.plusWrapper,
          {
            backgroundColor:
              theme.screens.primary.slightBackgroundContrastColor,
          },
        ]}>
        <MedsenseIcon
          icon="plus"
          color={theme.accentColor}
          size={{height: 20}}
        />
      </View>
      <MedsenseText
        flavor="accent"
        size="sm"
        style={[styles.title, margin('top', 'p1')]}>
        {title}
      </MedsenseText>
    </Pressable>
  );
};

const PLUS_WRAPPER_SIZE = 60;

const styles = StyleSheet.create({
  self: {
    flexDirection: 'column',
    paddingVertical: Layout.standardSpacing.p4,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  plusWrapper: {
    width: PLUS_WRAPPER_SIZE,
    height: PLUS_WRAPPER_SIZE,
    borderRadius: PLUS_WRAPPER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textTransform: 'uppercase',
  },
});
