import * as React from 'react';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useCallback, useState} from 'react';
import {isValidPassword} from '@app/models/profile';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {View} from 'react-native';

const copy = {
  cta: 'Change',
  cancel: 'Cancel',

  heading: 'Change Password',

  labels: {
    oldPassword: 'Old password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
  },

  errors: {
    missingOldPw: 'Please enter your old password',
    missingNewPw: 'Please enter your new password',
    invalidConfirm: 'Please make sure your passwords match',
  },
};

type ChangePasswordFormProps = {
  onSubmit(oldPassword: string, newPassword: string): void;
  onPressCancel(): void;
};

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  onPressCancel,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onPressCTA = useCallback(() => {
    if (
      !isValidPassword(oldPassword) ||
      !isValidPassword(newPassword) ||
      newPassword !== confirmPassword
    ) {
      return setHasSubmitted(true);
    }

    onSubmit(oldPassword, newPassword);
  }, [oldPassword, newPassword, confirmPassword, onSubmit]);

  return (
    <FullWidthContainer>
      <Card>
        <View style={margin('bottom', 'p2')}>
          <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
            {copy.heading}
          </MedsenseText>
        </View>
        <MedsenseTextInput
          placeholder={copy.labels.oldPassword}
          label={copy.labels.oldPassword}
          onChangeText={setOldPassword}
          value={oldPassword}
          textContentType="password"
          style={margin('bottom', 'p3')}
          autoCapitalize="none"
          secureTextEntry={true}
          errorText={
            hasSubmitted && !isValidPassword(oldPassword)
              ? copy.errors.missingOldPw
              : undefined
          }
        />
        <MedsenseTextInput
          placeholder={copy.labels.newPassword}
          label={copy.labels.newPassword}
          onChangeText={setNewPassword}
          value={newPassword}
          textContentType="password"
          style={margin('bottom', 'p3')}
          autoCapitalize="none"
          secureTextEntry={true}
          errorText={
            hasSubmitted && !isValidPassword(newPassword)
              ? copy.errors.missingNewPw
              : undefined
          }
        />
        <MedsenseTextInput
          placeholder={copy.labels.confirmPassword}
          label={copy.labels.confirmPassword}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          textContentType="password"
          style={margin('bottom', 'p3')}
          autoCapitalize="none"
          secureTextEntry={true}
          errorText={
            hasSubmitted && newPassword !== confirmPassword
              ? copy.errors.invalidConfirm
              : undefined
          }
        />
        <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
        <MedsenseButton
          style={margin('top', 'p2')}
          outline={true}
          onPress={onPressCancel}>
          {copy.cancel}
        </MedsenseButton>
      </Card>
    </FullWidthContainer>
  );
};
