import {useTheme} from '@app/contexts/theme';
import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';

export const ListToggleIndicator: React.FC<{selected: boolean}> = ({
  selected,
}) => {
  const theme = useTheme();
  if (selected) {
    return (
      <View
        style={[
          [
            styles.indicator,
            {
              backgroundColor: theme.accentColor,
              borderColor: theme.accentColor,
            },
          ],
        ]}>
        <Image source={require('./assets/checkmark.png')} />
      </View>
    );
  } else {
    return (
      <View
        style={[[styles.indicator, {borderColor: theme.input.borderColor}]]}
      />
    );
  }
};

const styles = StyleSheet.create({
  indicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
