import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

type SettingsDestructiveRowProps = {
  title: string;
  onPress(): void;
};

export const SettingsDestructiveRow: React.FC<SettingsDestructiveRowProps> = ({
  title,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.self, {borderBottomColor: theme.borderColor}]}>
      <View style={styles.textWrapper}>
        <MedsenseText flavor="danger" size="h3" weight="bold">
          {title}
        </MedsenseText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    paddingHorizontal: Layout.standardSpacing.p2,
    paddingVertical: Layout.standardSpacing.p4,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  textWrapper: {
    marginLeft: Layout.standardSpacing.p2,
    marginRight: Layout.standardSpacing.p2,
    flex: 1,
    alignItems: 'center',
  },
});
