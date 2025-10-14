import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';
import {OnboardingHeader} from '@app/shared/Onboarding/OnboardingHeader';
import {CreateAccountStackScreenProps} from '../types';
import {MedsenseButton} from '@app/components/Button';
import {useAuthStore} from '@app/stores/auth';

const check = require('./check.png');

type FinishedScreenProps = {} & CreateAccountStackScreenProps<'FinishedScreen'>;

const copy = {
  title: 'Account created!',
  subTitle:
    'You are officially ready to begin managing medications with Medsense. ',

  letsGo: 'Proceed to my account',
};

export const FinishedScreen: React.FC<FinishedScreenProps> = () => {
  const {setIsLoggedIn} = useAuthStore();
  const onPressDone = React.useCallback(() => {
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <OnboardingHeader />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, padding('horizontal', 'p05')]}>
        <Card style={[styles.card, margin('top', 'p1')]}>
          <Image source={check} style={[styles.checkImage]} />
          <MedsenseText
            align="center"
            style={[margin('vertical', 'p3')]}
            size="h1">
            {copy.title}
          </MedsenseText>
          <MedsenseText
            align="center"
            style={[margin('bottom', 'p3')]}
            flavor="muted">
            {copy.subTitle}
          </MedsenseText>
          <MedsenseButton onPress={onPressDone} style={margin('bottom', 'p2')}>
            {copy.letsGo}
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
  card: {},
  checkImage: {
    alignSelf: 'center',
  },
});
