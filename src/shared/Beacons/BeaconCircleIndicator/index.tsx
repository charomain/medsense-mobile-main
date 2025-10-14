import {Colors} from '@app/appearance/colors';
import {getColorFromColorType, isColorTypeLight} from '@app/models/medication';
import {ColorTypeModel} from '@app/models/beacon';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type BeaconCircleIndicatorProps = {
  colorType?: ColorTypeModel;
};

export const BeaconCircleIndicator: React.FC<BeaconCircleIndicatorProps> = ({
  colorType,
}) => {
  const backgroundColor = colorType
    ? getColorFromColorType(colorType)
    : undefined;
  const isLight = colorType ? isColorTypeLight(colorType) : false;

  return (
    <View style={[styles.indicator, isLight && styles.indicatorLightBorder]}>
      <View
        style={[
          styles.indicatorInner,
          isLight && styles.indicatorLightBorder,
          {backgroundColor},
        ]}
      />
    </View>
  );
};

const INDICATOR_SIZE = 46;
const INDICATOR_INNER_SIZE = INDICATOR_SIZE * 0.75;

const styles = StyleSheet.create({
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorLightBorder: {
    borderColor: Colors.dark,
    borderWidth: 1,
  },
  indicatorInner: {
    width: INDICATOR_INNER_SIZE,
    height: INDICATOR_INNER_SIZE,
    borderRadius: INDICATOR_INNER_SIZE / 2,
  },
});
