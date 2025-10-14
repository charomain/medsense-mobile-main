import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {Alert, Button, ScrollView, StyleSheet, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubStackScreenProps} from '../types';
import {FailureMessage} from './FailureMessage';
import {
  useHubSetupClient,
  useConnectToHubWifiNetwork,
  HubStatus,
} from '@app/services/hub';
import {StepRow} from './StepRow';
import {HubWifiContent} from './HubWifiContent';

type HubSetupScreenProps = HubStackScreenProps<'HubSetup'>;

const copy = {
  title: 'This mobile app is connecting to the Hub',
  subtitle1:
    'Once your app is connected to the Hub, the Hub will attempt to connect to your home WiFi.',
  subtitle2:
    'Please wait while the Hub connects. Do not exit this screen. While it connects, the Hub light will change from blinking blue to blinking  green. Once its blinking green, it will validate the WiFi credentials you entered. If it turns off, you entered them correctly. If it starts blinking blue, you will be taken back to re-enter it.',

  next: 'Yes, I see the green light',
};

const HubSetupContent: React.FC<{onPressNext(): void; status: HubStatus}> = ({
  status,
  onPressNext,
}) => {
  if (status.state === 'failed') {
    return <FailureMessage result={status.result} />;
  } else {
    const isConnecting = status.state === 'connecting-to-hub';
    const isConnected =
      status.state === 'configuring-hub' || status.state === 'rebooting-hub';

    return (
      <>
        <StepRow inProgress={isConnecting} finished={isConnected}>
          {status.state === 'connecting-to-hub' && 'Establishing connection...'}
          {isConnected && 'Connected to hub'}
        </StepRow>
        <StepRow
          inProgress={status.state === 'configuring-hub'}
          finished={status.state === 'rebooting-hub'}>
          {status.state === 'configuring-hub'
            ? `Configuring Hub (${status.percentDone}% done)`
            : 'Configure Hub'}
        </StepRow>
        <StepRow inProgress={status.state === 'rebooting-hub'} finished={false}>
          {status.state === 'rebooting-hub' ? 'Rebooting Hub...' : 'Reboot Hub'}
        </StepRow>
        <MedsenseButton onPress={onPressNext} style={margin('bottom', 'p2')}>
          {copy.next}
        </MedsenseButton>
      </>
    );
  }
};

export const HubSetupScreen: React.FC<HubSetupScreenProps> = ({
  navigation,
  route,
}) => {
  const onPressNext = React.useCallback(() => {
    navigation.navigate('HomeWifiConfirmation');
  }, [navigation]);

  const {homeWifiName, homeWifiPassword} = route.params;
  const hubWifiService = useConnectToHubWifiNetwork();
  const {status, logs} = useHubSetupClient(
    hubWifiService.status.state === 'connected',
    homeWifiName,
    homeWifiPassword,
  );

  React.useEffect(() => {
    if (status.state === 'rebooting-hub') {
      navigation.navigate('HubSetupConfirmComplete', route.params);
    }
  }, [status, navigation, route]);

  const onPressDiagnostics = React.useCallback(() => {
    Alert.alert('Logs', logs.current.join('\n'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading title="Hub Setup" subtitle={null} />
      <ScrollView>
        <Card style={margin('top', 'p3')}>
          <View style={margin('bottom', 'p2')}>
            <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
              {copy.title}
            </MedsenseText>
            <MedsenseText
              muted={true}
              style={Layout.standardHeadingBottomMargin}>
              {copy.subtitle1}
            </MedsenseText>
            <MedsenseText
              muted={true}
              style={Layout.standardHeadingBottomMargin}>
              {copy.subtitle2}
            </MedsenseText>
          </View>
          {status.state === 'idle' &&
            hubWifiService.status.state !== 'idle' && (
              <HubWifiContent status={hubWifiService.status} />
            )}
          {status.state !== 'idle' && (
            <HubSetupContent onPressNext={onPressNext} status={status} />
          )}
        </Card>
        <View style={styles.diagnosticButton}>
          <Button title="View Diagnostic Logs" onPress={onPressDiagnostics} />
        </View>
      </ScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  diagnosticButton: {
    fontSize: 10,
    marginTop: 25,
  },
});
