import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {InsightPercentCircle} from '@app/shared/Insights/InsightPercentCircle';
import {useTheme} from '@app/contexts/theme';

type OverallMedicationAdherenceProps = {
  adherencePercentage: number;
  style: StyleProp<ViewStyle>;
  onPressOverall(): void;
};

const copy = {
  main: 'Overall Medication Adherence',
};

export const OverallMedicationAdherence: React.FC<
  OverallMedicationAdherenceProps
> = ({adherencePercentage, style, onPressOverall}) => {
  const theme = useTheme();
  return (
    <Card onPress={onPressOverall} style={style} flavor="contrast">
      <View style={styles.row}>
        <MedsenseText style={styles.text} size="h3" flavor="contrast">
          {copy.main}
        </MedsenseText>
        <InsightPercentCircle
          color={theme.screens.contrast.textColor}
          size={70}
          percentage={adherencePercentage}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});
