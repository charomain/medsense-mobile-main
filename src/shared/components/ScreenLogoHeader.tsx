import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackButton, BackButtonBuffer} from './BackButton';
import {MedsenseLogo} from './MedsenseLogo';

type ScreenLogoHeaderProps = {
  onPressBack?(): void;
};

export const ScreenLogoHeader: React.FC<ScreenLogoHeaderProps> = ({
  onPressBack,
}) => {
  if (onPressBack) {
    return (
      <View style={styles.logoHeaderWithBackButtonRow}>
        <BackButton onPress={onPressBack} />
        <View style={[styles.logoHeader, styles.logoHeaderWithBackButton]}>
          <MedsenseLogo />
        </View>
        <BackButtonBuffer />
      </View>
    );
  }

  return (
    <View style={styles.logoHeader}>
      <MedsenseLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  logoHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  logoHeaderWithBackButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoHeaderWithBackButton: {
    flex: 1,
  },
});
