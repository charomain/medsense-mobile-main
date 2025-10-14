import {useTheme} from '@app/contexts/theme';
import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {View} from 'react-native';
import {MedsenseText} from '../Text';
import {ListToggleRow} from './ListToggleRow';
import {ListToggleIndicator} from './ListToggleIndicator';

type ListToggleOptionProps<T> = {
  option: T;
  getLabelForOption(value: T): string;
  selected: boolean;
  onPress(value: T): void;
  isOptionEnabled?(option: T): boolean;
};

export const ListToggleOption = <T,>({
  onPress,
  selected,
  option,
  getLabelForOption,
  isOptionEnabled,
}: ListToggleOptionProps<T>) => {
  const theme = useTheme();
  const label = getLabelForOption(option);
  const enabled = isOptionEnabled ? isOptionEnabled(option) : true;
  const onPressSelf = React.useCallback(() => {
    if (enabled) {
      onPress(option);
    }
  }, [onPress, option, enabled]);

  return (
    <ListToggleRow selected={selected} onPress={onPressSelf}>
      <ListToggleIndicator selected={selected} />
      <View style={margin('left', 'p1')}>
        <MedsenseText
          style={{
            color: selected
              ? theme.accentColor
              : enabled
              ? theme.screens.primary.textColor
              : theme.mutedColor,
          }}>
          {label}
        </MedsenseText>
      </View>
    </ListToggleRow>
  );
};
