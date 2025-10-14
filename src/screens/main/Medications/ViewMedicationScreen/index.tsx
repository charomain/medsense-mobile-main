import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {
  useMedicationTaxonomiesAPI,
  useSaveMedicationAPI,
} from '@app/shared/Medication/hooks';
import {MedicationListStackScreenProps} from '../types';
import {MedicationWizard} from '@app/shared/Medication/MedicationWizard';
import {convertAPIMedicationToViewModel} from '@app/shared/Medication/model';
import {useDeleteMedicationAPI} from './hooks';
import {Alert} from 'react-native';

type ViewMedicationScreenProps =
  MedicationListStackScreenProps<'ViewMedication'>;

export const ViewMedicationScreen: React.FC<ViewMedicationScreenProps> = ({
  navigation,
  route,
}) => {
  const {loading: deleteMedicationLoading, request: deleteMedication} =
    useDeleteMedicationAPI(() => {
      navigation.goBack();
    });

  const {loading, data} = useMedicationTaxonomiesAPI();
  const {medication} = route.params;

  const {saveMedication, loading: saving} = useSaveMedicationAPI(
    medication,
    () => {
      navigation.goBack();
    },
  );

  const medicationViewModel = React.useMemo(() => {
    if (!data) {
      return null;
    }

    return convertAPIMedicationToViewModel(medication, data.beaconSets);
  }, [medication, data]);

  const onPressDelete = React.useCallback(() => {
    Alert.alert(
      `Do you want to delete the adherence data for ${medication.name} as well?`,
      '',
      [
        {
          text: 'Yes',
          onPress: () =>
            deleteMedication({
              medicationId: medication.id,
              shouldDeleteStatistics: true,
            }),
        },
        {
          text: 'No',
          onPress: () =>
            deleteMedication({
              medicationId: medication.id,
              shouldDeleteStatistics: false,
            }),
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  }, [deleteMedication, medication]);

  return (
    <MedsenseScreen
      showLoadingOverlay={loading ?? deleteMedicationLoading ?? saving}
      includeSpacing={false}>
      {!loading && data && medicationViewModel && (
        <MedicationWizard
          dosageTypes={data.dosageTypes}
          medicationTypes={data.medicationTypes}
          containerTypes={data.containerTypes}
          medication={medicationViewModel}
          startOnSummary={true}
          onPressDelete={onPressDelete}
          onSave={saveMedication}
          freeBeacons={data.beacons}
          beaconSets={data.beaconSets}
          onPressBack={() => navigation.goBack()}
          isEditing={true}
          skipContainerSelection={false}
          onPressScanMore={() =>
            navigation.replace('AddMedication', {
              screen: 'QRScan',
            })
          }
        />
      )}
    </MedsenseScreen>
  );
};
