import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {isValidPassword, isValidEmail} from '@app/models/profile';
import {Linking, Pressable, StyleSheet, View} from 'react-native';
import {Checkbox} from './Checkbox';
import {MedsenseText} from '@app/components/Text';

const copy = {
  cta: 'Sign up with your email',

  errors: {
    missingEmail: 'Please enter an email',
    missingPassword:
      'Please enter a password. Passwords must be at least 6 characters.',
  },
};

type RegisterFormProps = {
  onSubmit(email: string, password: string): void;
  onPressSignIn(): void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onPressSignIn,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const onPressToggleTerms = useCallback(() => {
    setAgreedToTerms(!agreedToTerms);
  }, [agreedToTerms, setAgreedToTerms]);

  const onPressTerms = useCallback(() => {
    Linking.openURL('https://www.medsense.health/');
  }, []);

  const onPressCTA = useCallback(() => {
    if (!isValidEmail(email) || !password || !agreedToTerms) {
      return setHasSubmitted(true);
    }

    onSubmit(email, password);
  }, [email, password, agreedToTerms, onSubmit]);

  return (
    <FullWidthContainer>
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
          hasSubmitted && !isValidEmail(email)
            ? copy.errors.missingEmail
            : undefined
        }
      />
      <MedsenseTextInput
        label="Password"
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        textContentType="password"
        secureTextEntry={true}
        style={margin('bottom', 'p1')}
        errorText={
          hasSubmitted && !isValidPassword(password)
            ? copy.errors.missingPassword
            : undefined
        }
      />
      <View style={[styles.termsRow, margin('bottom', 'p2')]}>
        <Checkbox onPress={onPressToggleTerms} checked={agreedToTerms} />
        <Pressable
          onPress={onPressTerms}
          style={[styles.termsRowText, margin('left', 'p1')]}>
          <MedsenseText
            flavor={hasSubmitted && !agreedToTerms ? 'danger' : undefined}
            size="medium">
            I accept the{' '}
            <MedsenseText size="medium" flavor="accent">
              terms and conditions.
            </MedsenseText>
          </MedsenseText>
        </Pressable>
      </View>
      <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
      <Pressable onPress={onPressSignIn} style={margin('top', 'p4')}>
        <MedsenseText size="medium">
          Already have an account?{' '}
          <MedsenseText size="medium" flavor="accent">
            Sign in here
          </MedsenseText>
        </MedsenseText>
      </Pressable>
    </FullWidthContainer>
  );
};

const styles = StyleSheet.create({
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsRowText: {},
});
