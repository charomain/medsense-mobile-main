import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {Linking, Platform, ScrollView, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubStackScreenProps} from '../types';
import {
  checkPermissions,
  RequiredPermissions,
  getCurrentWifi,
} from '@app/services/hub';
type HomeWifiConfirmationScreenProps =
  HubStackScreenProps<'HomeWifiConfirmation'>;

const copy = {
  title: 'Connect to your home Wifi network',
  subtitle1:
    'The name of the home WiFi and associated password will be needed to complete the setup. ',
  subtitle2:
    'If your phone is connected to a 5G network or a network different than your home Wifi, you will need to go into your Wifi Settings on this device and connect to a non-5G network or your home network. After doing this, come back into the app and press refresh.',
  noWifi:
    'First, please make sure your phone is connected to your home Wifi network',

  tryAgain: 'Refresh',
  next: 'Yes',
};

type PermissionState =
  | {missingPermissions: RequiredPermissions[]}
  | null
  | 'granted';

const getCopyForMissingPermissions = (
  missingPermissions: RequiredPermissions[],
) => {
  if (Platform.OS === 'android') {
    return missingPermissions
      .map(p => {
        if (p === 'location-permissions') {
          return '"Location"';
        } else if (p === 'wifi-permissions') {
          return '"Wifi"';
        } else if (p === 'wifi-enabled') {
          return '"Wifi (turned off)"';
        }
      })
      .join(' and ');
  } else {
    return missingPermissions
      .map(p => {
        if (p === 'location-permissions') {
          return '"Location"';
        } else if (p === 'wifi-permissions') {
          return '"Local Network"';
        }
      })
      .join(' and ');
  }
};

// First, do you have your home WiFi network name and password ready? You will need that information in the next step.
export const HomeWifiConfirmationScreen: React.FC<
  HomeWifiConfirmationScreenProps
> = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [currentWifi, setCurrentWifi] = React.useState<string | null>(null);
  const [permissionState, setPermissionState] =
    React.useState<PermissionState>(null);
  const onPressNext = React.useCallback(() => {
    navigation.navigate('HomeWifiPassword', {
      homeWifiName: currentWifi!,
    });
  }, [currentWifi, navigation]);

  const tryGetWifi = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    setPermissionState(null);
    setCurrentWifi(null);

    try {
      const permissions = await checkPermissions();
      if (permissions.missingPermissions.length > 0) {
        setPermissionState({
          missingPermissions: permissions.missingPermissions,
        });
      } else {
        setPermissionState('granted');
        const res = await getCurrentWifi();
        setCurrentWifi(res);
      }
    } catch (err) {
      setError(err as any);
      setCurrentWifi(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentWifi, setLoading]);

  React.useEffect(() => {
    tryGetWifi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading title="Wifi Gateway Setup" subtitle="" />
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
            {permissionState !== 'granted' && permissionState !== null && (
              <>
                <MedsenseText flavor="danger">
                  Please make sure Medsense has permissions for{' '}
                  {getCopyForMissingPermissions(
                    permissionState.missingPermissions,
                  )}{' '}
                  turned on
                </MedsenseText>
                <MedsenseButton
                  onPress={() => Linking.openSettings()}
                  style={margin('top', 'p3')}>
                  Go To Settings
                </MedsenseButton>
              </>
            )}
            {permissionState === 'granted' && currentWifi === null && (
              <MedsenseText
                muted={true}
                style={Layout.standardHeadingBottomMargin}>
                {copy.noWifi}
              </MedsenseText>
            )}
            {currentWifi && (
              <MedsenseText
                muted={true}
                style={Layout.standardHeadingBottomMargin}>
                First, is{' '}
                <MedsenseText weight="bold" flavor="accent">
                  {currentWifi}
                </MedsenseText>{' '}
                the name of your home Wifi?
              </MedsenseText>
            )}
            {error && (
              <>
                <MedsenseText flavor="danger">
                  Unable to determine your wifi network:
                </MedsenseText>
                <MedsenseText flavor="danger">{error.message}</MedsenseText>
              </>
            )}
          </View>
          <MedsenseButton
            onPress={onPressNext}
            disabled={!currentWifi}
            style={margin('bottom', 'p2')}>
            {copy.next}
          </MedsenseButton>
          <MedsenseButton
            onPress={tryGetWifi}
            outline={true}
            style={margin('bottom', 'p2')}>
            {copy.tryAgain}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
