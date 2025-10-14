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

type PlugInHubSetupScreenProps = HubStackScreenProps<'PlugInHubSetup'>;

const copy = {
  title: 'Plug your Wifi Hub into a power outlet.',
  subtitle1:
    'Plug the Medsense Hub™ into an outlet near your medications.\n\nYour Hub will blink blue when ready.',
  subtitle2: 'Do you see the blinking blue light on your Hub?',

  next: 'Yes, I see the blue light',
  back: 'Cancel',
};

export const PlugInHubSetupScreen: React.FC<PlugInHubSetupScreenProps> = ({
  navigation,
}) => {
  const onPressNext = React.useCallback(() => {
    navigation.navigate('HomeWifiConfirmation');
  }, [navigation]);

  const onPressCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={() => navigation.goBack()}
        title="Wifi Hub Setup"
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
          </View>
          <MedsenseButton onPress={onPressNext} style={margin('bottom', 'p2')}>
            {copy.next}
          </MedsenseButton>
          <MedsenseButton onPress={onPressCancel} outline={true}>
            {copy.back}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
