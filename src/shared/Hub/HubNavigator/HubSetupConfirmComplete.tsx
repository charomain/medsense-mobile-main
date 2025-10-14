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

type HubSetupConfirmCompleteScreenProps =
  HubStackScreenProps<'HubSetupConfirmComplete'>;

const copy = {
  title: 'The Hub is connecting to your home WiFi',
  subtitle1:
    'Select the color light you see after the green light stops blinking.',
  subtitle2: 'This can take up to one minute.',

  next: 'Green light stopped blinking',
  back: 'Blue light started blinking',
};

export const HubSetupConfirmCompleteScreen: React.FC<
  HubSetupConfirmCompleteScreenProps
> = ({navigation, route}) => {
  const onPressNext = React.useCallback(() => {
    navigation.navigate('HubSetupComplete', route.params);
  }, [navigation, route]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading title="Hub Setup" subtitle="" />
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
          <MedsenseButton
            onPress={() => navigation.navigate('HomeWifiConfirmation')}
            outline={true}
            style={margin('bottom', 'p2')}>
            {copy.back}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
