import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import * as React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {MedsenseText} from './Text';

type BadgeProps = {
  text: string;
  flavor: 'danger' | 'neutral' | 'accent';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const Badge: React.FC<BadgeProps> = ({style, text, flavor, onPress}) => {
  const theme = useTheme();
  const textColorMap: Record<BadgeProps['flavor'], string> =
    React.useMemo(() => {
      return {
        danger: theme.dangerColor,
        neutral: theme.screens.primary.textColor,
        accent: theme.screens.primary.textColor,
      };
    }, [theme]);

  const bgColorMap: Record<BadgeProps['flavor'], string> = React.useMemo(() => {
    return {
      danger: theme.dangerLightColor,
      neutral: theme.screens.primary.backgroundColor,
      accent: theme.accentColor,
    };
  }, [theme]);

  const textColor = textColorMap[flavor];

  const Tag = onPress ? Pressable : View;

  return (
    <Tag
      onPress={onPress}
      style={[style, styles.self, {backgroundColor: bgColorMap[flavor]}]}>
      <MedsenseText weight="bold" style={{color: textColor}}>
        {text}
      </MedsenseText>
    </Tag>
  );
};

const styles = StyleSheet.create({
  self: {
    flexGrow: 0,
    borderRadius: Layout.listGroupBorderRadius,
    paddingVertical: Layout.standardSpacing.p05,
    paddingHorizontal: Layout.standardSpacing.p2,
  },
});
