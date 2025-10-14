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
import {MedsenseDateInput} from '@app/components/DateInput';
import {useSaveProfile} from './hooks';

type BirthdayScreenProps = {} & CreateAccountStackScreenProps<'BirthdayScreen'>;

const copy = {
  title: 'Nice! What is your date of birth?',
  subTitle: 'Please enter your birth date below.',

  next: 'Complete',
  back: 'Back',
};

export const BirthdayScreen: React.FC<BirthdayScreenProps> = ({
  navigation,
  route,
}) => {
  const {phone, firstName, lastName, email} = route.params;
  const {loading, updateProfile} = useSaveProfile(() => {
    navigation.navigate('OrganizationScreen');
  });
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const onPressSubmit = React.useCallback(() => {
    if (!dateOfBirth) {
      return setHasSubmitted(true);
    }

    updateProfile({
      phoneNumber: phone,
      firstName,
      lastName,
      dateOfBirth,
      email,
    });
  }, [phone, firstName, lastName, email, dateOfBirth, updateProfile]);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
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
          <MedsenseDateInput
            label="Birthday"
            emptyText={'Select your birthdate'}
            value={dateOfBirth}
            onChange={setDateOfBirth}
            dateFormat="MM/dd/uuuu"
            datePickerMode="date"
            defaultValue={new Date()}
            errorText={
              hasSubmitted && !dateOfBirth
                ? 'Please enter your birthday'
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
