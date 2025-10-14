import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ConnectivityStatusCircle} from '@app/shared/Beacons/ConnectivityStatusCircle';
import {useTenant} from '@app/contexts/tenant';

type SensorsCardProps = {
  isOnline?: boolean;
  style: StyleProp<ViewStyle>;
  onPressViewAll(): void;
};

const copy = {
  onlineStatusText: 'Sensors are Online',
  offlineStatusText: 'Sensors are Offline',
};

export const SensorsCard: React.FC<SensorsCardProps> = ({
  style,
  isOnline,
  onPressViewAll,
}) => {
  const tenant = useTenant();
  const heading = React.useMemo(() => {
    return tenant === 'toothcase' ? 'Sensors' : 'Medsense Sensors';
  }, [tenant]);

  return (
    <Card style={style}>
      <MedsenseText weight="bold" size="h2">
        {heading}
      </MedsenseText>
      <View style={[styles.onlineRow, margin('vertical', 'p2')]}>
        {(isOnline === true || isOnline === false) && (
          <ConnectivityStatusCircle isOnline={isOnline} />
        )}
        <MedsenseText>
          {isOnline ? copy.onlineStatusText : copy.offlineStatusText}
        </MedsenseText>
      </View>
      <MedsenseButton onPress={onPressViewAll}>View All Sensors</MedsenseButton>
    </Card>
  );
};

const styles = StyleSheet.create({
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
