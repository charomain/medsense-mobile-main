import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {generateArcForPercentage} from './utils';

type InsightPercentCircleProps = {
  percentage: number;
  size: number;
  color: string;
};

export const InsightPercentCircle: React.FC<InsightPercentCircleProps> = ({
  percentage,
  size,
  color,
}) => {
  return (
    <View style={{width: size, height: size}}>
      <View style={[StyleSheet.absoluteFill, styles.self]}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Path
            d={generateArcForPercentage(100, 45, percentage / 100)}
            strokeWidth={8}
            stroke={color}
          />
        </Svg>
        <View style={styles.textOverlay}>
          <MedsenseText style={{color}} size="h3">
            {Math.round(percentage)}%
          </MedsenseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
