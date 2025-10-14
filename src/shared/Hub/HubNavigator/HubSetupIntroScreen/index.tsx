import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubStackScreenProps} from '../types';

type HubSetupIntroScreenProps = HubStackScreenProps<'Intro'>;

const copy = {
  title: 'Let’s set up your Medsense Hub™',
  subtitle1:
    'Your Hub allows you to collect and analyze your medication adherence data at all times.',
  subtitle2:
    'If you have a Medsense Cellular Hub, please tap Cellular Hub Setup.',
  subtitle3:
    'Alternatively, to connect your Hub to your home WiFi network, please tap Wifi Hub Setup below.',

  cellSetup: 'Cellular Hub Setup\n  (most common)',
  wifiSetup: 'Wifi Hub Setup',
};

export const HubSetupIntroScreen: React.FC<HubSetupIntroScreenProps> = ({
  navigation,
}) => {
  const onPressCellSetup = React.useCallback(() => {
    navigation.navigate('CellHubSetup');
  }, [navigation]);

  const onPressWifiSetup = React.useCallback(() => {
    navigation.navigate('PlugInHubSetup');
  }, [navigation]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={() => navigation.navigate('Menu' as any)}
        title="Hub Setup"
        subtitle=""
      />
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
            <MedsenseText
              muted={true}
              style={Layout.standardHeadingBottomMargin}>
              {copy.subtitle3}
            </MedsenseText>
          </View>
          <MedsenseButton
            onPress={onPressCellSetup}
            style={margin('bottom', 'p2')}>
            {copy.cellSetup}
          </MedsenseButton>
          <MedsenseButton onPress={onPressWifiSetup} outline={true}>
            {copy.wifiSetup}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
