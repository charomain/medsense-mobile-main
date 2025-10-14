import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {useHubSettings} from '@app/stores/hub';
import {HubStackScreenProps} from '../types';

type CellHubSetupScreenProps = HubStackScreenProps<'CellHubSetup'>;

const copy = {
  title: 'How to connect with Medsense Cellular',
  subtitle1:
    'Setting up a Medsense Cellular Hub is easy, and one device will work for everybody in your home.',
  subtitle2:
    'Simply plug the device into a power outlet near a window in a location where you have a strong signal.',
  subtitle3: 'That’s it!',

  next: 'Complete Cellular Hub Setup',
  back: 'Cancel',
};

export const CellHubSetupScreen: React.FC<CellHubSetupScreenProps> = ({
  navigation,
}) => {
  const hubSettings = useHubSettings();
  const onPressNext = React.useCallback(() => {
    hubSettings.setHubSettings({
      hasSetup: false,
      ignoreHubSetupCTA: true,
    });
    navigation.navigate('Menu' as any);
    navigation.navigate('Medications' as any);
  }, [hubSettings, navigation]);

  const onPressCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={() => navigation.goBack()}
        title="Cellular Hub Setup"
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
