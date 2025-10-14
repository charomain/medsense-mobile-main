import * as React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type FullWidthContainerProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export const FullWidthContainer: React.FC<FullWidthContainerProps> = ({
  style,
  children,
}) => {
  return <View style={[styles.self, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  self: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});
