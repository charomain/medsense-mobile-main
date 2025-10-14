import {Colors} from '@app/appearance/colors';
import {colorForDoseEventType, DoseEventType} from '@app/models/insights';
import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';

type IndicatorCircleProps = {
  color: string;
  style: StyleProp<ViewStyle>;
  doseEventType?: DoseEventType;
};

export const IndicatorCircle: React.FC<IndicatorCircleProps> = ({
  style,
  color,
  doseEventType,
}) => {
  return (
    <View>
      <View style={[styles.self, {backgroundColor: color}, style]} />
      {doseEventType && (
        <View
          style={[
            styles.eventIndicator,
            {backgroundColor: colorForDoseEventType(doseEventType)},
          ]}
        />
      )}
    </View>
  );
};

const SIZE = 36;
const EVENT_SIZE = 16;

const styles = StyleSheet.create({
  self: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    margin: 4,
  },
  eventIndicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: Colors.white,
    width: EVENT_SIZE,
    height: EVENT_SIZE,
    borderRadius: EVENT_SIZE / 2,
  },
});
