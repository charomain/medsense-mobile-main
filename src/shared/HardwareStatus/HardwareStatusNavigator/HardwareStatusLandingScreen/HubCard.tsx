import {margin} from '@app/appearance/layout';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {ConnectivityStatusCircle} from '@app/shared/Beacons/ConnectivityStatusCircle';
import {Hub, doesAlertSignifyOnline} from '@app/models/beacon';
import {useTenant} from '@app/contexts/tenant';

type HubCardProps = {
  hubs: Hub[];
};

const copy = {
  onlineStatusText: 'Hub is Online',
  offlineStatusText: 'Hub is Offline',
};

const HubRow: React.FC<{hub: Hub}> = ({hub}) => {
  const isOnline = doesAlertSignifyOnline(hub.alert);
  return (
    <View style={[styles.onlineRow, margin('vertical', 'p2')]}>
      <ConnectivityStatusCircle isOnline={isOnline} />
      <MedsenseText>
        {isOnline ? copy.onlineStatusText : copy.offlineStatusText}
      </MedsenseText>
    </View>
  );
};

const HubSerialRow: React.FC<{hub: Hub}> = ({hub}) => {
  return (
    <MedsenseText style={margin('vertical', 'p1')}>
      {hub.deviceName}
    </MedsenseText>
  );
};

export const HubCard: React.FC<HubCardProps> = ({hubs}) => {
  const tenant = useTenant();
  const heading = React.useMemo(() => {
    return tenant === 'toothcase' ? 'Hub' : 'Medsense Hub';
  }, [tenant]);

  return (
    <Card>
      <MedsenseText weight="bold" size="h2">
        {heading}
      </MedsenseText>
      {hubs.map(hub => (
        <HubRow hub={hub} key={hub.deviceName} />
      ))}
      <View style={margin('vertical', 'p3')}>
        <MedsenseText>Serial Numbers</MedsenseText>
        {hubs.map(hub => (
          <HubSerialRow hub={hub} key={hub.deviceName} />
        ))}
      </View>
      {/* <MedsenseButton>Tap To Reset Hub</MedsenseButton> */}
    </Card>
  );
};

const styles = StyleSheet.create({
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
