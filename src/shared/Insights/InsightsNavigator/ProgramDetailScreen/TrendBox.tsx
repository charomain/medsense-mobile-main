import {Layout, margin} from '@app/appearance/layout';
import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {Colors} from '@app/appearance/colors';
import {MedsenseIcon} from '@app/components/Icon';

type TrendBoxProps = {
  text: string;
  direction: 'positive' | 'negative';
  style?: StyleProp<ViewStyle>;
};

export const TrendBox: React.FC<TrendBoxProps> = ({style, text, direction}) => {
  const textColor =
    direction === 'negative' ? Colors.missedRedText : Colors.takenGreenText;
  const bgColor =
    direction === 'negative' ? Colors.missedRed : Colors.positiveGreen;

  return (
    <View style={[style, styles.self, {backgroundColor: bgColor}]}>
      <MedsenseIcon
        icon={direction === 'negative' ? 'arrow-down' : 'arrow-up'}
        color={textColor}
        size={{height: 12}}
      />
      <MedsenseText
        size="sm"
        weight="bold"
        style={[{color: textColor}, margin('left', 'p1')]}>
        {text}
      </MedsenseText>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexGrow: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.listGroupBorderRadius,
    paddingVertical: Layout.standardSpacing.p05,
    paddingHorizontal: Layout.standardSpacing.p2,
  },
});
