import {Colors} from '@app/appearance/colors';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {getColorFromColorType, isColorTypeLight} from '@app/models/medication';
import {BeaconCircleIndicator} from '@app/shared/Beacons/BeaconCircleIndicator';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {OnlineRow} from './OnlineRow';
import {Specifications} from './Specifications';
import {BeaconWithMedications} from './hooks';
import {useTheme} from '@app/contexts/theme';
import {doesAlertSignifyOnline} from '@app/models/beacon';

type SensorCardProps = {
  beacon: BeaconWithMedications;
};

const getMedicationText = (beacon: BeaconWithMedications) => {
  if (beacon.medications.length > 1) {
    return 'Multiple Medications';
  } else if (beacon.medications.length === 1) {
    return beacon.medications[0].name;
  }

  return 'No medications assigned';
};

export const SensorCard: React.FC<SensorCardProps> = ({beacon}) => {
  const theme = useTheme();

  const isLight = isColorTypeLight(beacon.colorType);
  const backgroundColor = getColorFromColorType(beacon.colorType);
  const textColor = isLight ? Colors.dark : Colors.light;
  const textStyle = {color: textColor};
  const cardStyle = isLight && {borderColor: theme.borderColor, borderWidth: 1};

  return (
    <View
      style={[
        styles.self,
        cardStyle,
        margin('bottom', 'p1'),
        {backgroundColor},
      ]}>
      <View style={[styles.topRow, margin('bottom', 'p2')]}>
        <BeaconCircleIndicator colorType={beacon.colorType} />
        <View style={styles.info}>
          <MedsenseText size="h2" style={[textStyle]}>
            {getMedicationText(beacon)}
          </MedsenseText>
          <MedsenseText size="standard" style={textStyle}>
            {beacon.name}
          </MedsenseText>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <OnlineRow
          textStyle={textStyle}
          isOnline={doesAlertSignifyOnline(beacon.alert)}
        />
        {beacon.device && (
          <Specifications
            beaconDeviceDetails={beacon.device}
            textStyle={textStyle}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    borderRadius: Layout.buttonBorderRadius,
    paddingHorizontal: Layout.standardSpacing.p2,
    paddingVertical: Layout.standardSpacing.p2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 2,
    paddingHorizontal: Layout.standardSpacing.p1,
  },
  lightText: {
    color: Colors.white,
  },
  darkText: {
    color: Colors.dark,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
