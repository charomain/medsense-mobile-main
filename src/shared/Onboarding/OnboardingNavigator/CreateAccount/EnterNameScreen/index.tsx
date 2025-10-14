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

type EnterNameScreenProps =
  {} & CreateAccountStackScreenProps<'EnterNameScreen'>;

const copy = {
  title: 'Great! What is your name?',
  subTitle: 'Please enter your first and last name below.',

  next: 'Next',
  back: 'Back',
};

export const EnterNameScreen: React.FC<EnterNameScreenProps> = ({
  navigation,
  route,
}) => {
  const {phone, email} = route.params;
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const onPressSubmit = React.useCallback(() => {
    if (!firstName || !lastName) {
      return setHasSubmitted(true);
    }

    navigation.navigate('BirthdayScreen', {
      phone,
      firstName,
      lastName,
      email,
    });
  }, [firstName, lastName, navigation, phone, email]);

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
            label="First name"
            placeholder="Enter your first name here...."
            onChangeText={setFirstName}
            value={firstName}
            textContentType="givenName"
            style={margin('bottom', 'p3')}
            errorText={
              hasSubmitted ? 'Please enter your first name' : undefined
            }
          />
          <MedsenseTextInput
            label="Last name"
            placeholder="Enter your last name here...."
            onChangeText={setLastName}
            value={lastName}
            textContentType="familyName"
            style={margin('bottom', 'p3')}
            errorText={hasSubmitted ? 'Please enter your last name' : undefined}
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
