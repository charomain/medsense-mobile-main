import {standardFormElementSpacing} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {
  MedsenseTextInput,
  paddingStyleForTextInputContentText,
} from '@app/components/TextInput';
import * as React from 'react';
import {Animated} from 'react-native';

type ChangePasswordButtonProps = {
  onPress(): void;
};

export const ChangePasswordButton: React.FC<ChangePasswordButtonProps> = ({
  onPress,
}) => {
  const animatedIsFocused = React.useRef(new Animated.Value(0)).current;

  return (
    <MedsenseTextInput.Container
      onPress={onPress}
      style={standardFormElementSpacing()}>
      <MedsenseTextInput.Label
        label={'Change Password'}
        animatedValue={animatedIsFocused}
      />
      <MedsenseText style={paddingStyleForTextInputContentText()}>
        {''}
      </MedsenseText>
    </MedsenseTextInput.Container>
  );
};
