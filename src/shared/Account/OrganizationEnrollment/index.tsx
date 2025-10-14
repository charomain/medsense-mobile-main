import * as React from 'react';
import {StyleSheet} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {Card} from '@app/components/Card';

import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useSaveTenant} from '@app/shared/Onboarding/OnboardingNavigator/CreateAccount/OrganizationScreen/hooks';
import {useNavigation} from '@react-navigation/native';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';

type OrganizationEnrollmentProps = {};

const copy = {
  title:
    'Are you enrolling in Medsense Health as a member of an healthcare entity?',
  subTitle:
    'Please enter your organizational code below or press Skip if you are not part of an organization.',

  next: 'Save',
  back: 'Skip',
};

export const OrganizationEnrollment: React.FC<
  OrganizationEnrollmentProps
> = ({}) => {
  const navigation = useNavigation();
  const [organization, setOrganization] = React.useState('');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const {loading, updateTenant} = useSaveTenant(() => {
    setSaved(true);
  });

  const onPressSubmit = React.useCallback(() => {
    if (!organization) {
      return setHasSubmitted(true);
    }

    updateTenant({
      tenantCode: organization,
    });
  }, [organization, updateTenant]);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <ScreenLogoHeader onPressBack={() => navigation.goBack()} />
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
          {saved && (
            <MedsenseText style={margin('bottom', 'p2')} flavor="accent">
              All set! Your organization code is saved.
            </MedsenseText>
          )}
          {!saved && (
            <MedsenseButton onPress={onPressSubmit}>{copy.next}</MedsenseButton>
          )}
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
