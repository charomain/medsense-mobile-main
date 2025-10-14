import {useTheme} from '@app/contexts/theme';
import {Fonts, FontSizes} from '@app/appearance/fonts';
import * as React from 'react';
import {Platform, StyleProp, TextProps} from 'react-native';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {Theme} from '@app/contexts/theme';

type MedsenseTextFlavor = 'danger' | 'muted' | 'accent' | 'contrast';

type MedsenseFontWeight = 'bold';

export type MedsenseTextStyle = NonNullable<StyleProp<TextStyle>>;

type MedsenseTextProps = React.PropsWithChildren<{
  size?: keyof typeof FontSizes;
  align?: NonNullable<TextStyle['textAlign']>;
  style?: MedsenseTextStyle;
  muted?: boolean;
  flavor?: MedsenseTextFlavor;
  weight?: MedsenseFontWeight;
}>;

const textStyleForFlavor = (flavor: MedsenseTextFlavor, theme: Theme) => {
  switch (flavor) {
    case 'accent':
      return {color: theme.accentColor};
    case 'muted':
      return {color: theme.screens.primary.textMutedColor};
    case 'contrast':
      return {color: theme.screens.contrast.textColor};
    case 'danger':
      return {color: theme.dangerColor};
  }
};

const styleForWeight = (weight: MedsenseFontWeight) => {
  return Platform.OS === 'android'
    ? {fontFamily: Fonts.bold}
    : {fontWeight: weight};
};

export const textPropsFromMedsenseTextProps = (
  props: Omit<MedsenseTextProps, 'children'>,
  theme: Theme,
): TextProps => {
  const {size, align, style, muted, flavor, weight} = props;
  const textStyle = [
    styles.self,
    {fontSize: FontSizes[size ?? 'standard']},
    align ? {textAlign: align} : undefined,
    muted
      ? {color: theme.screens.primary.textMutedColor}
      : {color: theme.screens.primary.textColor},
    flavor && textStyleForFlavor(flavor, theme),
    weight && styleForWeight(weight),
    style,
  ];

  return {style: textStyle};
};

export const MedsenseText: React.FC<MedsenseTextProps> = ({
  children,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Text {...textPropsFromMedsenseTextProps(rest, theme)}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  self: {
    fontFamily: Fonts.primary,
  },
});
