import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {MedsenseText} from './Text';

type LoadingOverlayProps = {
  show: boolean;
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({show}) => {
  if (!show) {
    return null;
  }

  return (
    <View style={styles.self}>
      <View style={styles.inner}>
        <MedsenseText style={margin('bottom', 'p2')} flavor="muted">
          Loading...
        </MedsenseText>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 10,
  },
});
