import {useTheme} from '@app/contexts/theme';
import {Layout, margin, padding} from '@app/appearance/layout';
import {ListToggleIndicator} from '@app/components/ListToggle/ListToggleIndicator';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

type StepRowProps = React.PropsWithChildren<{
  finished: boolean;
  inProgress: boolean;
}>;

export const StepRow: React.FC<StepRowProps> = ({
  inProgress,
  finished,
  children,
}) => {
  const theme = useTheme();
  const borderStyle = {
    borderColor: finished ? theme.accentColor : theme.input.borderColor,
  };

  return (
    <View
      style={[
        styles.self,
        borderStyle,
        padding('all', 'p2'),
        margin('bottom', 'p2'),
      ]}>
      <ListToggleIndicator selected={finished} />
      <MedsenseText size="sm" style={margin('left', 'p2')}>
        {children}
      </MedsenseText>
      {inProgress && (
        <View style={margin('left', 'p2')}>
          <ActivityIndicator animating={true} size="small" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Layout.listGroupBorderRadius,
    alignItems: 'center',
  },
});
