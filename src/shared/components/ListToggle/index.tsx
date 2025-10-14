import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {margin} from '@app/appearance/layout';
import {ListToggleOption} from './ListToggleOption';
import {ListToggleContainer, ListToggleLabel} from './ListToggleContainer';
import {MedsenseText} from '../Text';

type ListToggleProps<T> = {
  label: string;
  selectedValues: T[] | T | null;
  options: T[];
  getLabelForOption(value: T): string;
  getKeyForOption(value: T): string | number;
  emptyText?: string;
  onPressOption(option: T): void;
  style?: StyleProp<ViewStyle>;
  closeOnSelect?: boolean;
  areValuesEqual?(v1: T, v2: T): boolean;
  isOptionEnabled?(option: T): boolean;
};

const ListToggleOpenContent = <T,>({
  onPressOption,
  selectedValues,
  options,
  getKeyForOption,
  getLabelForOption,
  areValuesEqual,
  isOptionEnabled,
}: ListToggleProps<T>) => {
  return (
    <>
      {options.map(o => (
        <ListToggleOption
          onPress={onPressOption}
          selected={
            selectedValues
              ? Array.isArray(selectedValues)
                ? !!selectedValues.find(s =>
                    areValuesEqual ? areValuesEqual(s, o) : s === o,
                  )
                : areValuesEqual
                ? areValuesEqual(selectedValues, o)
                : o === selectedValues
              : false
          }
          key={`${getKeyForOption(o)}`}
          option={o}
          getLabelForOption={getLabelForOption}
          isOptionEnabled={isOptionEnabled}
        />
      ))}
    </>
  );
};

export const ListToggle = <T,>(props: ListToggleProps<T>) => {
  const {
    label,
    emptyText,
    selectedValues,
    style,
    onPressOption,
    closeOnSelect,
  } = props;

  const [open, setOpen] = React.useState(false);
  const onPressSelf = React.useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const onPressOptionWrapped = React.useCallback(
    (option: T) => {
      if (closeOnSelect) {
        setOpen(false);
      }

      onPressOption(option);
    },
    [onPressOption, closeOnSelect],
  );

  const hasSelection = Array.isArray(selectedValues)
    ? !!selectedValues.length
    : !!selectedValues;

  return (
    <ListToggleContainer onPress={onPressSelf} style={[style]}>
      <ListToggleLabel label={label} />
      {!!emptyText && !hasSelection && (
        <MedsenseText style={open && margin('bottom', 'p3')} muted={true}>
          {emptyText}
        </MedsenseText>
      )}
      {!!selectedValues && hasSelection && (
        <MedsenseText style={open && margin('bottom', 'p3')} muted={true}>
          {Array.isArray(selectedValues)
            ? selectedValues.map(v => props.getLabelForOption(v)).join(', ')
            : props.getLabelForOption(selectedValues)}
        </MedsenseText>
      )}
      {!!open && (
        <ListToggleOpenContent
          {...props}
          onPressOption={onPressOptionWrapped}
        />
      )}
    </ListToggleContainer>
  );
};
