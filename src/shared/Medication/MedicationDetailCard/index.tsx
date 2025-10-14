import {Colors} from '@app/appearance/colors';
import {Layout, margin} from '@app/appearance/layout';
import {
  Medication,
  getScheduleFrequencyDescriptor,
  isMedicationColorLight,
  nextDoseDay,
  isSmartBoxMedication,
} from '@app/models/medication';
import * as React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {MedsenseText} from '@app/shared/components/Text';
import {Badge} from '@app/shared/components/Badge';
import {MedicationCard} from '@app/shared/Medication/MedicationCard';
import {StyleProp} from 'react-native';
import {EditButton} from './EditButton';
import {format, isAfter} from 'date-fns';
import {TIME_FORMAT} from '@app/models/date';

type MedicationDetailCardProps = {
  medication: Medication;
  onPressEdit(): void;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
  onPressSmartBoxAction?(
    medication: Medication,
    action: 'reload' | 'reset',
  ): void;
};

const copy = {
  nextDose: 'Next dose',
};

const getNextDoseTime = (medication: Medication): string | null => {
  if (!medication.scheduleTimes) {
    return null;
  }

  const nextTimeToday = medication.scheduleTimes?.find(time =>
    isAfter(time.date, new Date()),
  );

  if (!nextTimeToday) {
    const nextTimeTomorrow = medication.scheduleTimes[0];

    if (
      medication.frequency === 'daily' ||
      medication.frequency === 'recurring-interval'
    ) {
      return nextTimeTomorrow
        ? `Tomorrow at ${format(nextTimeTomorrow.date, TIME_FORMAT)}`
        : null;
    } else if (medication.frequency === 'specific-days') {
      const nextDay = nextDoseDay(medication) ?? 'Tomorrow';
      return nextTimeTomorrow
        ? `${nextDay} at ${format(nextTimeTomorrow.date, TIME_FORMAT)}`
        : null;
    }
  }

  return nextTimeToday ? format(nextTimeToday.date, TIME_FORMAT) : null;
};

export const MedicationDetailCard: React.FC<MedicationDetailCardProps> = ({
  medication,
  onPressEdit,
  onPress,
  onPressSmartBoxAction,
  style,
}) => {
  const isLight = isMedicationColorLight(medication);
  const textColor = isLight ? Colors.dark : '#fff';
  // const textStyle = !isLight && styles.white;
  const textStyle = {color: textColor};

  const onPressReload = React.useCallback(() => {
    if (onPressSmartBoxAction) {
      onPressSmartBoxAction(medication, 'reload');
    }
  }, [medication, onPressSmartBoxAction]);

  const onPressReset = React.useCallback(() => {
    if (onPressSmartBoxAction) {
      onPressSmartBoxAction(medication, 'reset');
    }
  }, [medication, onPressSmartBoxAction]);

  return (
    <MedicationCard onPress={onPress} style={style} medication={medication}>
      <View style={styles.topRow}>
        <MedicationCard.Indicator medication={medication} />
        <View style={styles.info}>
          <MedicationCard.Name medication={medication} />
          <MedsenseText
            size="standard"
            style={[textStyle, margin('bottom', 'p05')]}>
            {getScheduleFrequencyDescriptor(medication)}
          </MedsenseText>
          {isSmartBoxMedication(medication) &&
            !!medication.credits &&
            medication.credits > 0 && (
              <MedsenseText size="standard" style={textStyle}>
                {medication.credits} Credit(s)
              </MedsenseText>
            )}
        </View>
        <View style={styles.lastDoseCol}>
          <MedsenseText size="sm" style={textStyle}>
            {copy.nextDose}
          </MedsenseText>
          <MedsenseText size="sm" style={[styles.lastDoseText, textStyle]}>
            {getNextDoseTime(medication) ?? 'n/a'}
          </MedsenseText>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <EditButton onPressEdit={onPressEdit} textColor={textColor} />
        <View style={styles.takeNowContainer}>
          {medication.isActivePush && <Badge flavor="danger" text="Take now" />}
          {isSmartBoxMedication(medication) && (
            <View style={[styles.smartBoxButtons, margin('top', 'p1')]}>
              <Badge
                onPress={onPressReload}
                flavor="neutral"
                text="Reload"
                style={margin('right', 'p1')}
              />
              <Badge onPress={onPressReset} flavor="danger" text="Reset" />
            </View>
          )}
        </View>
      </View>
    </MedicationCard>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 2,
    paddingHorizontal: Layout.standardSpacing.p1,
  },
  white: {
    color: Colors.white,
  },
  lastDoseLabelText: {
    textAlign: 'right',
  },
  lastDoseText: {
    marginTop: Layout.standardSpacing.p1 / 2,
    textAlign: 'right',
    opacity: 0.5,
  },
  lastDoseCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bottomRow: {
    marginTop: Layout.standardSpacing.p1,
    flexDirection: 'row',
  },
  takeNowContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  smartBoxButtons: {
    flexDirection: 'row',
  },
});
