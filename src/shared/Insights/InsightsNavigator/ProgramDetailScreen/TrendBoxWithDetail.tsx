import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TrendBox} from './TrendBox';
import {MedsenseText} from '@app/components/Text';

type TrendBoxWithDetailProps = {
  text: string;
  direction: 'positive' | 'negative';
  style?: StyleProp<ViewStyle>;
};

export const TrendBoxWithDetail: React.FC<TrendBoxWithDetailProps> = ({
  style,
  text,
  direction,
}) => {
  return (
    <View style={[style, styles.self]}>
      <TrendBox text={text} direction={direction} />
      <MedsenseText
        size="sm"
        align="right"
        style={margin('top', 'p1')}
        flavor="muted">
        since last period
      </MedsenseText>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexGrow: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
