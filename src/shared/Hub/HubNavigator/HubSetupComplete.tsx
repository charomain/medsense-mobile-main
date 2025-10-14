import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubStackScreenProps} from './types';
import {useHubSettings} from '@app/stores/hub';
import {useWifiSettings} from '@app/stores/wifi';

type HubSetupCompleteScreenProps = HubStackScreenProps<'HubSetupComplete'>;

const copy = {
  title: 'Great! Your Hub is online.',
  subtitle1:
    'Please proceed to the homepage to add your medications, configure your notifications, track your adherence, and more!',
  subtitle2:
    'As always, tap the Help button to contact support or email support@medsense.health',

  next: 'Return home',
  back: 'Blue light started blinking',
};

export const HubSetupCompleteScreen: React.FC<HubSetupCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const {setHubSettings} = useHubSettings();
  const {setWifiSettings} = useWifiSettings();

  React.useEffect(() => {
    setHubSettings({
      hasSetup: true,
    });

    setWifiSettings({
      previousWifi: {
        ssid: route.params.homeWifiName,
        password: route.params.homeWifiPassword,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressNext = React.useCallback(() => {
    navigation.navigate('Medications' as any);
  }, [navigation]);

  return (
    <MedsenseScreen includeSpacing={true}>
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
          </View>
          <MedsenseButton onPress={onPressNext} style={margin('bottom', 'p2')}>
            {copy.next}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
