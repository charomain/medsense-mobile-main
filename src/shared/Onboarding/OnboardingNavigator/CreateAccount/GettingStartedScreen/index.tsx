import * as React from 'react';
import {StyleSheet} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';
import {OnboardingHeader} from '@app/shared/Onboarding/OnboardingHeader';
import {CreateAccountStackScreenProps} from '../types';
import {MedsenseButton} from '@app/components/Button';

type SplashScreenProps =
  {} & CreateAccountStackScreenProps<'GettingStartedScreen'>;

const copy = {
  title: 'Getting Started',
  subTitle:
    "Let's make taking medications easy. Please answer the following questions to get started.",

  letsGo: "Let's go!",
  back: 'Back',
};

export const GettingStartedScreen: React.FC<SplashScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <MedsenseScreen includeSpacing={true}>
      <OnboardingHeader />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, padding('horizontal', 'p05')]}>
        <Card style={margin('top', 'p1')}>
          <MedsenseText style={[margin('bottom', 'p3')]} size="h1">
            {copy.title}
          </MedsenseText>
          <MedsenseText style={[margin('bottom', 'p3')]} flavor="muted">
            {copy.subTitle}
          </MedsenseText>
          <MedsenseButton
            onPress={() =>
              navigation.navigate('EnterPhoneScreen', route.params)
            }
            style={margin('bottom', 'p2')}>
            {copy.letsGo}
          </MedsenseButton>
          <MedsenseButton onPress={() => navigation.goBack()} outline={true}>
            {copy.back}
          </MedsenseButton>
        </Card>
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'stretch',
  },
});
