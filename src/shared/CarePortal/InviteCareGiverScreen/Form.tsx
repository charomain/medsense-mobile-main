import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {isValidEmail} from '@app/models/profile';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';

const copy = {
  title: 'Enter email for caregiver below',
  subtitle: 'We will send an invitation to be a caregiver to this email.',

  btns: {
    send: 'Send',
    cancel: 'Cancel',
  },
  errors: {
    missingEmail: 'Please enter an email',
  },
};

type InviteCareGiverFormProps = {
  onSubmit(email: string): void;
  onCancel(): void;
};

export const InviteCareGiverForm: React.FC<InviteCareGiverFormProps> = ({
  onSubmit,
  onCancel,
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
      <MedsenseText style={margin('bottom', 'p2')} size="h1">
        {copy.title}
      </MedsenseText>
      <MedsenseText style={margin('bottom', 'p5')} flavor="muted">
        {copy.subtitle}
      </MedsenseText>
      <MedsenseTextInput
        placeholder="Enter email to send invite to..."
        label="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        style={margin('bottom', 'p5')}
        autoCapitalize="none"
        errorText={
          hasSubmitted && !isValidEmail(email)
            ? copy.errors.missingEmail
            : undefined
        }
      />
      <MedsenseButton onPress={onPressCTA}>{copy.btns.send}</MedsenseButton>
      <MedsenseButton
        style={margin('top', 'p2')}
        outline={true}
        onPress={onCancel}>
        {copy.btns.cancel}
      </MedsenseButton>
    </Card>
  );
};
