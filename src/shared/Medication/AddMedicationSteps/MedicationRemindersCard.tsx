import {standardFormElementSpacing} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {
  MedicationViewModel,
  NotificationType,
  NOTIFICATION_TYPE_LABELS,
} from '../model';

type MedicationRemindersCardProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Reminders',
  subheading: 'Please enable the reminder types you would like to use.',
  typeLabel: 'Medication reminders',
  typeEmptyText: 'When do you want reminders...',
};

const OPTIONS: NotificationType[] = ['every-dose', 'when-i-forget'];

export const MedicationRemindersCard: React.FC<
  MedicationRemindersCardProps
> = ({onPressBack, onPressNext, medication}) => {
  const [notificationType, setNotificationType] = React.useState(
    medication.notificationType,
  );
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      notificationType,
    });
  }, [onPressNext, notificationType, medication]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <ListToggle<NotificationType>
        label={copy.typeLabel}
        emptyText={copy.typeEmptyText}
        selectedValues={notificationType ? [notificationType] : []}
        getKeyForOption={t => t}
        getLabelForOption={t => NOTIFICATION_TYPE_LABELS[t]}
        options={OPTIONS}
        onPressOption={setNotificationType}
        closeOnSelect={true}
        style={standardFormElementSpacing()}
      />
    </MedicationFormCard>
  );
};

// const styles = StyleSheet.create({});
