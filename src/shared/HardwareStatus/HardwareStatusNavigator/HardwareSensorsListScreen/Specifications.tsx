import {Layout, margin} from '@app/appearance/layout';
import {MedsenseText, MedsenseTextStyle} from '@app/components/Text';
import {BeaconDeviceDetails} from '@app/models/beacon';
import {DATE_AND_TIME_FORMAT} from '@app/models/date';
import {format} from 'date-fns';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type SpecificationsProps = {
  textStyle: MedsenseTextStyle;
  beaconDeviceDetails: BeaconDeviceDetails;
};

export const Specifications: React.FC<SpecificationsProps> = ({
  textStyle,
  beaconDeviceDetails,
}) => {
  return (
    <View style={styles.self}>
      <MedsenseText
        align="right"
        size="sm"
        style={[styles.topLabel, margin('bottom', 'p05'), textStyle]}>
        Specifications
      </MedsenseText>
      <MedsenseText
        align="right"
        size="sm"
        style={[margin('bottom', 'p05'), textStyle]}>
        Battery Life: {beaconDeviceDetails.battery}%
      </MedsenseText>
      <MedsenseText
        align="right"
        size="sm"
        style={[margin('bottom', 'p05'), textStyle]}>
        Signal Strength: {beaconDeviceDetails.signalStrength}
      </MedsenseText>
      <MedsenseText
        align="right"
        size="sm"
        style={[margin('bottom', 'p05'), textStyle]}>
        Last Signal:{' '}
        {format(beaconDeviceDetails.updatedAt, DATE_AND_TIME_FORMAT)}
      </MedsenseText>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  topLabel: {
    marginTop: Layout.standardSpacing.p1 / 2,
    textAlign: 'right',
    opacity: 0.5,
  },
});
