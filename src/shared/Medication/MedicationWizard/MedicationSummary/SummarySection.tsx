import * as React from 'react';
import {View} from 'react-native';
import {margin} from '@app/appearance/layout';
import {SummaryHeader} from './SummaryHeader';
import {EditButton} from './EditButton';

type SummarySectionProps = React.PropsWithChildren<{
  title: string;
  onPressEdit?(): void;
}>;

export const SummarySection: React.FC<SummarySectionProps> = ({
  onPressEdit,
  title,
  children,
}) => {
  return (
    <View style={margin('bottom', 'p3')}>
      <SummaryHeader>{title}</SummaryHeader>
      {onPressEdit && (
        <EditButton style={margin('top', 'p1')} onPress={onPressEdit} />
      )}
      <View style={margin('top', 'p1')}>{children}</View>
    </View>
  );
};
