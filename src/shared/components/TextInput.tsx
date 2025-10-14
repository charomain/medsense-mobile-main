import {Fonts, FontSizes} from '@app/appearance/fonts';
import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import React, {FC, PropsWithChildren} from 'react';
import {
  Animated,
  TextInput,
  TextInputProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Pressable,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
} from 'react-native';
import {MedsenseText, textPropsFromMedsenseTextProps} from './Text';
import {MedsenseIcon} from './Icon';

type MedsenseTextInputLabelProps = {
  label: string;
  style?: StyleProp<TextStyle>;
  animatedValue: Animated.Value;
};

const MedsenseTextInputLabel: FC<MedsenseTextInputLabelProps> = ({
  label,
  style,
  animatedValue,
}) => {
  const theme = useTheme();
  const labelStyle = {
    position: 'absolute' as 'absolute',
    backgroundColor: theme.screens.primary.backgroundColor,
    left: Layout.standardSpacing.p1 / 2,
    paddingHorizontal: Layout.standardSpacing.p1 / 2,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [15, -5],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [FontSizes.standard, FontSizes.sm],
    }),
  };

  return (
    <Animated.Text
      {...textPropsFromMedsenseTextProps(
        {
          size: 'sm',
          style: [labelStyle as any, style],
        },
        theme,
      )}>
      {label}
    </Animated.Text>
  );
};

const MedsenseTextInputContainer: FC<
  PropsWithChildren<{
    onPress?: () => void;
    style?: MedsenseTextInputProps['style'];
    errorText?: string;
  }>
> = ({children, style, onPress, errorText}) => {
  const theme = useTheme();
  const Tag = onPress ? Pressable : View;

  return (
    <View style={[styles.container, style]}>
      <Tag
        onPress={onPress}
        style={[styles.self, {borderColor: theme.input.borderColor}]}>
        {children}
      </Tag>
      {errorText && (
        <MedsenseText style={[margin('top', 'p2'), {color: theme.dangerColor}]}>
          {errorText}
        </MedsenseText>
      )}
    </View>
  );
};

type MedsenseTextInputProps = {
  style?: StyleProp<ViewStyle>;
  errorText?: string;
  label?: string;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor'>;

type IMedsenseTextInput = FC<MedsenseTextInputProps> & {
  Container: typeof MedsenseTextInputContainer;
  Label: typeof MedsenseTextInputLabel;
};

export const paddingStyleForTextInputContentText = () => {
  return {
    paddingVertical: Layout.standardSpacing.p2,
    paddingHorizontal: Layout.standardSpacing.p1,
  };
};

const ShowHideEyeIconButton: React.FC<{
  onPress(): void;
  status: 'off' | 'on';
}> = ({onPress, status}) => {
  const icon = status === 'off' ? 'eye-off' : 'eye-on';
  const theme = useTheme();

  return (
    <Pressable onPress={onPress}>
      <MedsenseIcon
        style={styles.showHideIcon}
        icon={icon}
        size={{height: 10}}
        color={theme.screens.primary.textColor}
      />
    </Pressable>
  );
};

export const MedsenseTextInput: IMedsenseTextInput = ({
  style,
  errorText,
  label,
  value,
  placeholder,
  onBlur,
  onFocus,
  ...props
}) => {
  const theme = useTheme();
  const animatedIsFocused = React.useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const onPressTogglePasswordVisibility = React.useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    },
    [setIsFocused, onFocus],
  );

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    },
    [setIsFocused, onBlur],
  );

  const shouldLabelFloat = React.useMemo(() => {
    return isFocused || placeholder !== label;
  }, [isFocused, placeholder, label]);

  React.useEffect(() => {
    Animated.timing(animatedIsFocused, {
      useNativeDriver: false,
      toValue: shouldLabelFloat || value !== '' ? 1 : 0,
      duration: 200,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLabelFloat]);

  return (
    <MedsenseTextInputContainer errorText={errorText} style={[style]}>
      {label && (
        <MedsenseTextInputLabel
          style={undefined}
          label={label}
          animatedValue={animatedIsFocused}
        />
      )}
      <TextInput
        {...props}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          props.secureTextEntry && styles.passwordPadding,
          {color: theme.input.textColor},
        ]}
        placeholderTextColor={theme.input.placeholderColor}
        placeholder={shouldLabelFloat ? placeholder : undefined}
        secureTextEntry={props.secureTextEntry && !showPassword}
      />
      {props.secureTextEntry && (
        <ShowHideEyeIconButton
          status={showPassword ? 'on' : 'off'}
          onPress={onPressTogglePasswordVisibility}
        />
      )}
    </MedsenseTextInputContainer>
  );
};

MedsenseTextInput.Container = MedsenseTextInputContainer;
MedsenseTextInput.Label = MedsenseTextInputLabel;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  self: {
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.standard,
    ...paddingStyleForTextInputContentText(),
  },
  showHideIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    zIndex: 999999,
    padding: 20,
  },
  passwordPadding: {
    marginRight: 50,
  },
});
