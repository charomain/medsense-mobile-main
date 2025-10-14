import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type CardProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  flavor?: 'contrast';
  onPress?(): void;
}>;

export const Card: React.FC<CardProps> = ({
  style,
  children,
  flavor,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={style}>
      <View
        style={[
          styles.self,
          {
            backgroundColor:
              flavor === 'contrast'
                ? theme.screens.contrast.backgroundColor
                : theme.screens.primary.backgroundColor,
            shadowColor: theme.screens.primary.shadowColor,
          },
        ]}>
        {children}
      </View>
    </Pressable>
  );
};
// background: linear-gradient(100.66deg, #383838 6.56%, #121212 93.57%);
const styles = StyleSheet.create({
  self: {
    borderRadius: 10,
    padding: Layout.standardSpacing.p3,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
});
