import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {
  useMedicationTaxonomiesAPI,
  useSaveMedicationAPI,
} from '@app/shared/Medication/hooks';
import {AddMedicationStackScreenProps} from '../types';
import {MedicationWizard} from '@app/shared/Medication/MedicationWizard';
import {
  MedicationViewModel,
  newMedicationViewModel,
} from '@app/shared/Medication/model';
import {Alert} from 'react-native';

type AddMedicationScreenProps = AddMedicationStackScreenProps<'AddMedication'>;

type InitialMedicationState = {
  key: number;
  medication: MedicationViewModel;
};

export const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({
  navigation,
}) => {
  const {loading, data} = useMedicationTaxonomiesAPI();
  const [initialMedication, setInitialMedication] =
    React.useState<InitialMedicationState>({
      medication: newMedicationViewModel(),
      key: 0,
    });

  const {saveMedication, loading: saving} = useSaveMedicationAPI(
    null,
    (showAddAnotherPopup, prevMedication) => {
      if (showAddAnotherPopup) {
        const device = prevMedication.container?.isPillOrganizer
          ? 'the weekly pill organizer'
          : 'the smartbox';
        Alert.alert(
          `Would you like to add another medication to ${device}?`,
          '',
          [
            {
              text: 'No',
              onPress: () => {
                navigation.goBack();
              },
            },
            {
              text: 'Yes',
              onPress: () => {
                const newMed = newMedicationViewModel();
                newMed.container = prevMedication.container;
                newMed.organizers = prevMedication.organizers;
                setInitialMedication({
                  key: initialMedication.key + 1,
                  medication: newMed,
                });
              },
            },
          ],
        );
      } else {
        navigation.goBack();
      }
    },
  );

  return (
    <MedsenseScreen
      showLoadingOverlay={loading || saving}
      includeSpacing={false}>
      {!loading && data && (
        <MedicationWizard
          dosageTypes={data.dosageTypes}
          medicationTypes={data.medicationTypes}
          containerTypes={data.containerTypes}
          medication={initialMedication.medication}
          startOnSummary={false}
          onPressDelete={null}
          onSave={saveMedication}
          freeBeacons={data.beacons}
          onPressBack={() => navigation.goBack()}
          onPressScanMore={() => navigation.replace('QRScan')}
          beaconSets={data.beaconSets}
          key={initialMedication.key}
          isEditing={false}
          skipContainerSelection={initialMedication.key > 0}
        />
      )}
    </MedsenseScreen>
  );
};
