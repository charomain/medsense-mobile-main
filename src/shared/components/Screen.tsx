import {useTheme} from '@app/contexts/theme';
import {padding} from '@app/appearance/layout';
import {View} from 'react-native';
import * as React from 'react';
import {LoadingOverlay} from './LoadingOverlay';
import {SafeAreaView, StyleSheet} from 'react-native';

type MedsenseScreenProps = React.PropsWithChildren<{
  includeSpacing?: boolean;
  showLoadingOverlay?: boolean;
}>;

export const MedsenseScreen: React.FC<MedsenseScreenProps> = ({
  children,
  includeSpacing,
  showLoadingOverlay,
}) => {
  const theme = useTheme();

  return (
    <>
      <SafeAreaView
        style={[
          styles.self,
          {backgroundColor: theme.screens.primary.backgroundColor},
        ]}>
        <View
          style={[
            styles.container,
            includeSpacing && padding('horizontal', 'p3'),
          ]}>
          {children}
        </View>
      </SafeAreaView>
      {<LoadingOverlay show={showLoadingOverlay ?? false} />}
    </>
  );
};

const styles = StyleSheet.create({
  self: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
