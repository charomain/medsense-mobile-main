import * as React from 'react';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {isValidEmail} from '@app/models/profile';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {View} from 'react-native';

const copy = {
  cta: 'Add',
  cancel: 'Cancel',
  errors: {
    missingEmail: 'Please enter an email',
  },

  heading: 'Enter patient details below',
  subheader:
    'For starters, please fill out the patient email they will use with Medsense.',
};

type CreateAccountFormProps = {
  onSubmit(email: string): void;
  onPressCancel(): void;
};

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSubmit,
  onPressCancel,
}) => {
  const [email, setEmail] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onPressCTA = useCallback(() => {
    if (!isValidEmail(email)) {
      return setHasSubmitted(true);
    }

    onSubmit(email);
  }, [email, onSubmit]);

  return (
    <Card>
      <View style={margin('bottom', 'p2')}>
        <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
          {copy.heading}
        </MedsenseText>
        <MedsenseText muted={true} style={Layout.standardHeadingBottomMargin}>
          {copy.subheader}
        </MedsenseText>
      </View>
      <MedsenseTextInput
        placeholder="Email"
        label="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        style={margin('bottom', 'p3')}
        autoCapitalize="none"
        errorText={
          hasSubmitted && !isValidEmail(email)
            ? copy.errors.missingEmail
            : undefined
        }
      />
      <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
      <MedsenseButton
        style={margin('top', 'p3')}
        outline={true}
        onPress={onPressCancel}>
        {copy.cancel}
      </MedsenseButton>
    </Card>
  );
};
