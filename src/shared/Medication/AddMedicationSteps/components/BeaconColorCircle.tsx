import {FreeBeaconModel, getBeaconColor} from '@app/models/beacon';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type BeaconColorCircleProps = {
  beacon: FreeBeaconModel;
};

export const BeaconColorCircle: React.FC<BeaconColorCircleProps> = ({
  beacon,
}) => {
  return (
    <View
      style={[
        [
          styles.indicator,
          {
            backgroundColor: getBeaconColor(beacon),
          },
        ],
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
