import {Layout} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, Switch, View} from 'react-native';

type NotificationToggleRowProps = {
  label: string;
  value: boolean;
  onToggle(newValue: boolean): void;
};

export const NotificationToggleRow: React.FC<NotificationToggleRowProps> = ({
  label,
  value,
  onToggle,
}) => {
  return (
    <View style={styles.self}>
      <MedsenseText>{label}</MedsenseText>
      <Switch onValueChange={onToggle} value={value} />
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.standardSpacing.p1 / 2,
  },
});
