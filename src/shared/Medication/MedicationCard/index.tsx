import {Layout} from '@app/appearance/layout';
import {
  Medication,
  getColorFromColorType,
  isMedicationColorLight,
} from '@app/models/medication';
import * as React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {MedicationCardIndicator} from './MedicationCardIndicator';
import {MedicationCardMedicationName} from './MedicationCardMedicationName';
import {StyleProp} from 'react-native';
import {Pressable} from 'react-native';
import {useTheme} from '@app/contexts/theme';

type MedicationCardProps = React.PropsWithChildren<{
  medication: Medication;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}>;

type IMedicationCard = React.FC<MedicationCardProps> & {
  Indicator: typeof MedicationCardIndicator;
  Name: typeof MedicationCardMedicationName;
};

export const MedicationCard: IMedicationCard = ({
  medication,
  children,
  style,
  onPress,
}) => {
  const backgroundColor = medication.colorType
    ? getColorFromColorType(medication.colorType)
    : undefined;
  const isLight = isMedicationColorLight(medication);
  const theme = useTheme();

  const cardStyle = isLight && {borderColor: theme.borderColor, borderWidth: 1};

  const Tag = onPress ? Pressable : View;
  return (
    <Tag
      onPress={onPress}
      style={[styles.self, {backgroundColor}, cardStyle, style]}>
      {children}
    </Tag>
  );
};

const styles = StyleSheet.create({
  self: {
    borderRadius: Layout.buttonBorderRadius,
    paddingHorizontal: Layout.standardSpacing.p2,
    paddingVertical: Layout.standardSpacing.p2,
  },
});

MedicationCard.Name = MedicationCardMedicationName;
MedicationCard.Indicator = MedicationCardIndicator;
