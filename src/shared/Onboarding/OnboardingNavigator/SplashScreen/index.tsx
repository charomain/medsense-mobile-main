import * as React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useAuthStore} from '@app/stores/auth';

import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';
import {OnboardingHeader} from '@app/shared/Onboarding/OnboardingHeader';
import {LoginForm} from './LoginForm';
import {OnboardingStackScreenProps} from '../types';
import {useLoginAPI} from './hooks';
import {useCallback} from 'react';

type SplashScreenProps = {} & OnboardingStackScreenProps<'Splash'>;

const copy = {
  login: 'Login',
  createAccount: 'Don’t have an account?',
  signUpHere: 'Sign up here',
};

export const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const onPressRegister = useCallback(() => {
    navigation.push('Register');
  }, [navigation]);

  const {setIsLoggedIn} = useAuthStore();
  const {loading, login, error} = useLoginAPI(() => {
    setIsLoggedIn(true);
  });

  const onPressForgotPassword = React.useCallback(() => {
    navigation.push('ForgotPassword');
  }, [navigation]);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, padding('horizontal', 'p05')]}>
        <OnboardingHeader />
        <Card style={margin('top', 'p1')}>
          <MedsenseText style={[margin('bottom', 'p3')]} size="h1">
            {copy.login}
          </MedsenseText>
          <LoginForm
            onSubmit={login}
            onPressForgotPassword={onPressForgotPassword}
            error={error}
          />
          <Pressable style={margin('top', 'p5')} onPress={onPressRegister}>
            <MedsenseText size="medium">
              {copy.createAccount}{' '}
              <MedsenseText size="medium" flavor="accent">
                {copy.signUpHere}
              </MedsenseText>
            </MedsenseText>
          </Pressable>
        </Card>
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'stretch',
    minHeight: 700,
  },
});
