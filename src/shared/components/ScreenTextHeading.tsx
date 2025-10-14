import {useTheme} from '@app/contexts/theme';
import {Layout, padding} from '@app/appearance/layout';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {MedsenseText} from './Text';
import {BackButton, BackButtonBuffer} from './BackButton';

type ScreenTextHeadingProps = {
  title: string;
  subtitle: string | null;
  onPressBack?(): void;
};

export const ScreenTextHeading: React.FC<ScreenTextHeadingProps> = ({
  title,
  subtitle,
  onPressBack,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.self]}>
      <View style={[styles.contentRow, padding('bottom', 'p3')]}>
        {onPressBack && <BackButton onPress={onPressBack} />}
        <View style={styles.textWrapper}>
          <MedsenseText
            align="center"
            size="h2"
            style={!!subtitle && padding('bottom', 'p1')}>
            {title}
          </MedsenseText>
          {subtitle && (
            <MedsenseText muted={true} align="center">
              {subtitle}
            </MedsenseText>
          )}
        </View>
        {onPressBack && <BackButtonBuffer />}
      </View>
      <View style={[styles.border, {backgroundColor: theme.mutedColor}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    marginBottom: Layout.standardSpacing.p3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  border: {
    height: 1,
    opacity: 0.1,
  },
  textWrapper: {
    flex: 1,
  },
});
