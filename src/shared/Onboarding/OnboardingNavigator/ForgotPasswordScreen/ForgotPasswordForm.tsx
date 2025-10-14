import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {Card} from '@app/components/Card';

const copy = {
  cta: 'Send Request',

  errors: {
    missingEmail: 'Please enter an email',
  },
};

type ForgotPasswordFormProps = {
  onSubmit(data: {email: string}): void;
};

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onPressCTA = useCallback(() => {
    if (!email) {
      return setHasSubmitted(true);
    }

    onSubmit({email});
  }, [email, onSubmit]);

  return (
    <Card>
      <MedsenseTextInput
        label="Email"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        style={margin('bottom', 'p3')}
        autoCapitalize="none"
        errorText={
          hasSubmitted && !email ? copy.errors.missingEmail : undefined
        }
      />
      <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
    </Card>
  );
};
