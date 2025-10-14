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
import {MedsenseTextInput} from '@app/components/TextInput';

type SplashScreenProps = {} & CreateAccountStackScreenProps<'EnterPhoneScreen'>;

const copy = {
  title: 'What is your phone number?',
  subTitle: 'You can enable text and calls.',

  next: 'Next',
  back: 'Back',
};

export const EnterPhoneScreen: React.FC<SplashScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;
  const [phone, setPhone] = React.useState('+1');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const onPressSubmit = React.useCallback(() => {
    if (!phone || !phone.startsWith('+1') || phone.length !== 12) {
      return setHasSubmitted(true);
    }

    navigation.navigate('EnterNameScreen', {
      phone,
      email,
    });
  }, [phone, navigation, email]);

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
          <MedsenseTextInput
            label="Phone"
            placeholder="Enter your phone number here..."
            onChangeText={setPhone}
            value={phone}
            textContentType="telephoneNumber"
            style={margin('bottom', 'p3')}
            errorText={
              hasSubmitted
                ? 'Please enter a phone. Make sure to add your country code'
                : undefined
            }
          />
          <MedsenseButton
            onPress={onPressSubmit}
            style={margin('bottom', 'p2')}>
            {copy.next}
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
