import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import {MedsenseIcon, Icon} from '@app/components/Icon';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

type SettingsRowProps = {
  icon: Icon;
  title: string;
  onPress(): void;
};

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.self, {borderBottomColor: theme.borderColor}]}>
      <MedsenseIcon icon={icon} color={theme.accentColor} size={{height: 24}} />
      <View style={styles.textWrapper}>
        <MedsenseText size="h3" weight="bold">
          {title}
        </MedsenseText>
      </View>
      <MedsenseIcon
        icon="right-chevron"
        color={theme.mutedColor}
        size={{height: 14}}
      />
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
  },
});
