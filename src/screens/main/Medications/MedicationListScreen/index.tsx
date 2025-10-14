import * as React from 'react';
import {MedicationListStackScreenProps} from '../types';
import {useFocusEffect} from '@react-navigation/native';
import {useMedicationsAPI} from '@app/shared/Medication/hooks';
import {Medication} from '@app/models/medication';
import {MedicationList} from './MedicationList';
import {usePatientContext} from '@app/contexts/patient';
import {Alert} from 'react-native';

type MedicationListScreenProps =
  MedicationListStackScreenProps<'MedicationList'>;

const copy = {
  heading: 'Medications',
  subtitle: 'Your Patient Account',
  yourMedications: 'Your Medications',
};

export const MedicationListScreen: React.FC<MedicationListScreenProps> = ({
  navigation,
}) => {
  const patientProfile = usePatientContext();
  const {medications, hasFreeBeacons, refetch, loading, search, reload, reset} =
    useMedicationsAPI();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onPressAdd = React.useCallback(() => {
    if (hasFreeBeacons) {
      navigation.navigate('AddMedication', {
        params: undefined,
        screen: 'AddMedication',
      });
    } else {
      navigation.navigate('AddMedication', {
        params: undefined,
        screen: 'QRScan',
      });
    }
  }, [navigation, hasFreeBeacons]);

  const onPressEdit = React.useCallback(
    (medication: Medication) => {
      navigation.navigate('ViewMedication', {
        medication,
      });
    },
    [navigation],
  );

  const onPressMedication = React.useCallback(
    (medication: Medication) => {
      if (medication.isActivePush) {
        navigation.navigate('TakeNow', {
          medication,
        });
      }
    },
    [navigation],
  );

  const onPressSmartBoxAction = React.useCallback(
    (medication: Medication, action: 'reload' | 'reset') => {
      if (action === 'reload') {
        reload({
          medicationId: medication.id,
        });

        Alert.alert(
          'All set!',
          'You can now reload your SmartBox. Your SmartBox will not record doses for the next 2 minutes.',
        );
      } else if (action === 'reset') {
        reset({
          medicationId: medication.id,
        });

        Alert.alert(
          'All set!',
          'Your credits have been reset. Credits are generated when you pull out packs that are due at a later time.',
        );
      }
    },
    [reload, reset],
  );

  return (
    <MedicationList
      onPressAdd={onPressAdd}
      onPressEdit={onPressEdit}
      onPressMedication={onPressMedication}
      loading={loading}
      refetch={refetch}
      medications={medications}
      onPressSmartBoxAction={onPressSmartBoxAction}
      onPressSearch={search}
      onPressSetupHub={() =>
        navigation.navigate('More' as any, {
          screen: 'Hub',
        })
      }
      onPressBack={patientProfile ? navigation.goBack : undefined}
      title={
        patientProfile?.profile
          ? `${patientProfile.profile?.firstName}`
          : copy.heading
      }
      subtitle={patientProfile?.profile ? 'Patient Account' : copy.subtitle}
      belowFoldTitle={
        patientProfile?.profile?.firstName
          ? `${patientProfile.profile.firstName}'s Medication`
          : copy.yourMedications
      }
    />
  );
};
