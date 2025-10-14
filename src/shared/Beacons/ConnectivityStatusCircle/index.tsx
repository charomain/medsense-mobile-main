import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type ConnectivityStatusCircleProps = {
  isOnline: boolean;
};

const CONNECTED_GREEN = 'rgba(59, 185, 0, 1)';
const DISCONNECTED_RED = 'red';

export const ConnectivityStatusCircle: React.FC<
  ConnectivityStatusCircleProps
> = ({isOnline}) => {
  return (
    <View
      style={[
        styles.self,
        margin('right', 'p1'),
        {backgroundColor: isOnline ? CONNECTED_GREEN : DISCONNECTED_RED},
      ]}
    />
  );
};

const SIZE = 8;

const styles = StyleSheet.create({
  self: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
});
