import * as React from 'react';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {MedsenseText} from '@app/components/Text';

const copy = {
  cta: 'Sign In',
  forgotPassword: 'Forgot your password?',
  recover: 'Recover here.',
  errors: {
    missingEmail: 'Please enter an email',
    missingPassword:
      'Please enter a password. Passwords must be at least 6 characters.',
  },
};

const isValidPassword = (password: string) => {
  return password.length >= 6;
};

type LoginFormProps = {
  onSubmit(email: string, password: string): void;
  onPressForgotPassword(): void;
  error?: Error;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onPressForgotPassword,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onPressCTA = useCallback(() => {
    if (!email || !password) {
      return setHasSubmitted(true);
    }

    onSubmit(email, password);
  }, [email, password, onSubmit]);

  return (
    <FullWidthContainer>
      {error && (
        <MedsenseText style={margin('bottom', 'p3')} flavor="danger">
          The email or password you entered is incorrect. Please try again.
        </MedsenseText>
      )}
      <MedsenseTextInput
        label="Email"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        style={margin('bottom', 'p3')}
        autoCapitalize="none"
        keyboardType="email-address"
        errorText={
          hasSubmitted && !email ? copy.errors.missingEmail : undefined
        }
      />
      <MedsenseTextInput
        label="Password"
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        textContentType="password"
        secureTextEntry={true}
        style={margin('bottom', 'p3')}
        errorText={
          hasSubmitted && !isValidPassword(password)
            ? copy.errors.missingPassword
            : undefined
        }
      />
      <Pressable
        style={styles.forgotPasswordButtom}
        onPress={onPressForgotPassword}>
        <MedsenseText size="medium">
          {copy.forgotPassword}{' '}
          <MedsenseText size="medium" flavor="accent">
            {copy.recover}
          </MedsenseText>
        </MedsenseText>
      </Pressable>
      <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
    </FullWidthContainer>
  );
};

const styles = StyleSheet.create({
  forgotPasswordButtom: {
    marginBottom: Layout.standardSpacing.p4,
  },
});
