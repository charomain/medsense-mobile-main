import * as React from 'react';
import {Animated} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  MedsenseTextInput,
  paddingStyleForTextInputContentText,
} from './TextInput';
import {MedsenseText} from './Text';
import {standardFormElementSpacing} from '@app/appearance/layout';
import {format} from 'date-fns';

type MedsenseDateInputProps = {
  label: string;
  emptyText: string;
  value: Date | null;
  defaultValue: Date;
  onChange(newValue: Date | null): void;
  dateFormat: string; // date-fns format() format
  datePickerMode: 'date' | 'time';
  errorText?: string;
};

export const MedsenseDateInput: React.FC<MedsenseDateInputProps> = ({
  defaultValue,
  emptyText,
  label,
  value,
  onChange,
  dateFormat,
  datePickerMode,
  errorText,
}) => {
  const [showTimeSelector, setShowTimeSelector] = React.useState(false);
  const onPressTime = React.useCallback(() => {
    setShowTimeSelector(true);
  }, [setShowTimeSelector]);

  const animatedIsFocused = React.useRef(new Animated.Value(1)).current;

  return (
    <>
      <MedsenseTextInput.Container
        onPress={onPressTime}
        errorText={errorText}
        style={standardFormElementSpacing()}>
        <MedsenseTextInput.Label
          label={label}
          animatedValue={animatedIsFocused}
        />
        <MedsenseText style={paddingStyleForTextInputContentText()}>
          {value ? format(value, dateFormat) : emptyText}
        </MedsenseText>
      </MedsenseTextInput.Container>
      <DatePicker
        modal
        open={showTimeSelector}
        date={value ?? defaultValue}
        mode={datePickerMode}
        title={label}
        onConfirm={date => {
          onChange(date);
          setShowTimeSelector(false);
        }}
        onCancel={() => {
          setShowTimeSelector(false);
        }}
      />
    </>
  );
};
