import {margin} from '@app/appearance/layout';
import {Card} from '@app/components/Card';
import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SummarySection} from './SummarySection';
import {
  getDosageDescriptor,
  getNotificationTypeDescriptor,
  isMedicationPRN,
  isUploadedPhoto,
  MedicationViewModel,
  WizardSteps,
} from '../../model';
import {MedsenseText} from '@app/components/Text';
import {MedsenseButton} from '@app/components/Button';
import {BeaconColorCircle} from '@app/shared/Medication/AddMedicationSteps/components/BeaconColorCircle';
import {getFullUploadUrl} from '@app/models/common';

type MedicationSummaryProps = {
  medication: MedicationViewModel;
  goBackToStep(step: WizardSteps): void;
  onPressSave(): void;
  onPressDelete: (() => void) | null;
};

const copy = {
  medicationName: 'Medication Name',
  medicationType: 'Medication Type',
  medicationPhoto: 'Medication Photo',
  doseSchedule: 'Dose & Schedule',
  containerType: 'Container Type',
  reminders: 'Reminder(s)',
  sensor: 'Sensor Color',

  saveButton: 'Save',
  deleteButton: 'Delete',
};

export const MedicationSummary: React.FC<MedicationSummaryProps> = ({
  medication,
  goBackToStep,
  onPressSave,
  onPressDelete,
}) => {
  return (
    <MedsenseScreen>
      <Card style={margin('top', 'p3')}>
        <View style={margin('vertical', 'p3')}>
          <SummarySection
            onPressEdit={() => goBackToStep('name')}
            title={copy.medicationName}>
            <MedsenseText muted={true}>{medication.name}</MedsenseText>
          </SummarySection>
          <SummarySection
            onPressEdit={() => goBackToStep('type')}
            title={copy.medicationType}>
            <MedsenseText muted={true}>
              {medication.medicationType?.name}
            </MedsenseText>
          </SummarySection>
          <SummarySection
            onPressEdit={() => goBackToStep('photo')}
            title={copy.medicationPhoto}>
            {medication.photo && (
              <Image
                style={styles.photoPreview}
                source={{
                  uri: isUploadedPhoto(medication.photo)
                    ? getFullUploadUrl(medication.photo.uploadPath)
                    : `file://${medication.photo?.path}`,
                }}
              />
            )}
          </SummarySection>
          <SummarySection
            onPressEdit={() => goBackToStep('dosage')}
            title={copy.doseSchedule}>
            <MedsenseText muted={true}>
              {getDosageDescriptor(medication)}
            </MedsenseText>
          </SummarySection>
          <SummarySection
            onPressEdit={() => goBackToStep('container')}
            title={copy.containerType}>
            <MedsenseText muted={true}>
              {medication.container?.name}
            </MedsenseText>
          </SummarySection>
          {!isMedicationPRN(medication) && (
            <SummarySection
              onPressEdit={() => goBackToStep('reminders')}
              title={copy.reminders}>
              <MedsenseText muted={true}>
                {!!medication.notificationType &&
                  getNotificationTypeDescriptor(medication.notificationType)}
              </MedsenseText>
            </SummarySection>
          )}
          {medication.container?.id !== 1 && (
            <SummarySection
              onPressEdit={() => goBackToStep('beacon')}
              title={copy.sensor}>
              <MedsenseText muted={true}>
                {medication.beacon && (
                  <BeaconColorCircle beacon={medication.beacon} />
                )}
              </MedsenseText>
            </SummarySection>
          )}
          <MedsenseButton onPress={onPressSave}>
            {copy.saveButton}
          </MedsenseButton>
          {onPressDelete && (
            <MedsenseButton
              style={margin('top', 'p4')}
              flavor="danger"
              outline={true}
              onPress={onPressDelete}>
              {copy.deleteButton}
            </MedsenseButton>
          )}
        </View>
      </Card>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  photoPreview: {
    width: 100,
    height: 100,
  },
});
