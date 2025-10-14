import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {FailureMessage} from './FailureMessage';
import {HubWifiStatus} from '@app/services/hub';
import {margin} from '@app/appearance/layout';

const MESSAGE_FOR_STATUS: Record<HubWifiStatus['state'], string> = {
  idle: 'Idle',
  'starting-connect': 'Trying to connect...',
  connecting: 'Connecting...',
  connected: 'Connected',
  failed: 'Failed',
};

export const HubWifiContent: React.FC<{status: HubWifiStatus}> = ({status}) => {
  if (status.state === 'failed') {
    return <FailureMessage result={status.result} />;
  } else {
    return (
      <View style={styles.self}>
        <ActivityIndicator animating={true} size="large" />
        <MedsenseText style={margin('top', 'p3')}>
          {MESSAGE_FOR_STATUS[status.state]}
        </MedsenseText>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  self: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
