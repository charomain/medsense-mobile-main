import * as React from 'react';
import {StyleSheet} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';
import {OnboardingHeader} from '@app/shared/Onboarding/OnboardingHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RegisterForm} from './RegisterForm';
import {useRegisterAPI} from './hooks';
import {CreateAccountStackScreenProps} from '../types';
import {margin, padding} from '@app/appearance/layout';

type RegisterScreenProps = CreateAccountStackScreenProps<'RegisterScreen'>;

const copy = {
  heading: 'Sign up',
  subheading: 'Fill in the fields below to sign up for an account.',
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {loading, register} = useRegisterAPI(email => {
    navigation.replace('GettingStartedScreen', {
      email,
    });
  });

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <OnboardingHeader onPressBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, padding('horizontal', 'p05')]}>
        <Card>
          <MedsenseText style={margin('bottom', 'p2')} size="h2">
            {copy.heading}
          </MedsenseText>
          <MedsenseText flavor="muted" style={margin('bottom', 'p4')}>
            {copy.subheading}
          </MedsenseText>
          <RegisterForm
            onPressSignIn={() => navigation.goBack()}
            onSubmit={register}
          />
        </Card>
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 5,
  },
});
