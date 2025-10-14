import {Fonts, FontSizes} from '@app/appearance/fonts';
import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import * as React from 'react';
import {StyleProp, StyleSheet, TextInput, View, ViewStyle} from 'react-native';
import {MedsenseButton} from '../Button';
import {MedsenseIcon} from '../Icon';

type SearchBarProps = {
  style: StyleProp<ViewStyle>;
  placeholder?: string;
  onPressSearch(query: string): void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  style,
  placeholder,
  onPressSearch,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const onPressSearchWrapped = React.useCallback(() => {
    onPressSearch(searchQuery);
  }, [searchQuery, onPressSearch]);

  return (
    <View style={[styles.self, style, {borderColor: theme.borderColor}]}>
      <MedsenseIcon
        icon="search"
        color={theme.accentColor}
        size={{height: 15}}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.input.placeholderColor}
        style={styles.input}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <MedsenseButton onPress={onPressSearchWrapped} size="sm-1">
        Search
      </MedsenseButton>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    paddingVertical: Layout.standardSpacing.p1,
    paddingHorizontal: Layout.standardSpacing.p1,
    borderRadius: Layout.listGroupBorderRadius,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.medium,
    flex: 1,
    marginHorizontal: Layout.standardSpacing.p1,
  },
});
