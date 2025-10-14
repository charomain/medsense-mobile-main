import * as React from 'react';
import {StyleSheet} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';
import {useSaveTenant} from './hooks';
import {OnboardingHeader} from '@app/shared/Onboarding/OnboardingHeader';

import {CreateAccountStackScreenProps} from '../types';
import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';

type OrganizationScreenProps =
  {} & CreateAccountStackScreenProps<'OrganizationScreen'>;

const copy = {
  title:
    'Are you enrolling in Medsense Health as a member of an healthcare entity?',
  subTitle:
    'Please enter your organizational code below or press Skip if you are not part of an organization.',

  next: 'Next',
  back: 'Skip',
};

export const OrganizationScreen: React.FC<OrganizationScreenProps> = ({
  navigation,
}) => {
  const [organization, setOrganization] = React.useState('');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const {loading, updateTenant} = useSaveTenant(() => {
    navigation.replace('FinishedScreen');
  });

  const onPressSubmit = React.useCallback(() => {
    if (!organization) {
      return setHasSubmitted(true);
    }

    updateTenant({
      tenantCode: organization,
    });
  }, [organization, updateTenant]);

  const onPressSkip = React.useCallback(() => {
    navigation.navigate('FinishedScreen');
  }, [navigation]);

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
          <MedsenseTextInput
            label="Organization Code"
            placeholder="Enter your organizational code here...."
            onChangeText={setOrganization}
            value={organization}
            style={margin('bottom', 'p3')}
            errorText={
              hasSubmitted ? 'Please enter your organizational code' : undefined
            }
          />
          <MedsenseButton
            onPress={onPressSubmit}
            style={margin('bottom', 'p2')}>
            {copy.next}
          </MedsenseButton>
          <MedsenseButton onPress={onPressSkip} outline={true}>
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
