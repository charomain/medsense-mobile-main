import * as React from 'react';
import {StyleSheet, Alert} from 'react-native';
import {Layout} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ForgotPasswordForm} from './ForgotPasswordForm';
import {OnboardingStackScreenProps} from '../types';
import {useWrappedMedsenseAPIRequest} from '@app/services/api';
import {forgotPasswordRequest} from '@app/services/api/auth';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';

type ForgotPasswordScreenProps = OnboardingStackScreenProps<'ForgotPassword'>;

const copy = {
  heading: 'Forgot Your Password?',
  subtitle:
    "Don't worry! Enter your email and we will send you a new password.",

  success: {
    title: 'Success',
    body: 'We emailed you a reset password link',
  },
};

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const onSend = React.useCallback(() => {
    Alert.alert(copy.success.title, copy.success.body, [
      {
        text: 'ok',
      },
    ]);
  }, []);
  const {loading, request: requestPasswordReset} = useWrappedMedsenseAPIRequest(
    forgotPasswordRequest,
    onSend,
  );

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <ScreenLogoHeader onPressBack={() => navigation.goBack()} />
        <ScreenTextHeading title={copy.heading} subtitle={copy.subtitle} />
        <ForgotPasswordForm onSubmit={requestPasswordReset} />
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Layout.standardSpacing.p3,
  },
});
