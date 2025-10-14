import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {MedsenseScreen} from '@app/components/Screen';
import * as React from 'react';
import {SettingsRow} from '@app/shared/components/SettingsRow';
import {ViewPatientStackScreenProps} from './types';
import {SettingsDestructiveRow} from '@app/shared/components/SettingsDestructiveRow';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {usePatientContext} from '@app/contexts/patient';
import {nameWithLastInitial} from '@app/models/profile';
import {ScrollView} from 'react-native';

type ViewPatientScreenProps = ViewPatientStackScreenProps<'ViewPatientMenu'> & {
  removePatient(): void;
};

const copy = {
  title: 'Menu',
  options: 'Options',
  removePatient: 'Remove Patient',
};

export const PatientMenu: React.FC<ViewPatientScreenProps> = ({
  navigation,
  removePatient,
}) => {
  const patientProfile = usePatientContext();

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={navigation.goBack}
        title={nameWithLastInitial(patientProfile?.profile) ?? ''}
        subtitle={copy.options}
      />
      <ScrollView>
        <FullWidthContainer>
          <SettingsRow
            title="Medications"
            icon="pill"
            onPress={() => navigation.navigate('PatientMedication')}
          />
          <SettingsRow
            title="Insights"
            icon="graph"
            onPress={() => navigation.navigate('PatientInsights')}
          />
          <SettingsRow
            title="Caregivers"
            icon="care-givers"
            onPress={() => navigation.navigate('PatientCareGivers')}
          />
          {/* <SettingsRow
            title="Notifications"
            icon="notifications"
            onPress={() => {}}
          /> */}
          <SettingsRow
            title="My Account"
            icon="gear"
            onPress={() => navigation.push('PatientEditAccount')}
          />
          <SettingsDestructiveRow
            title={copy.removePatient}
            onPress={removePatient}
          />
        </FullWidthContainer>
      </ScrollView>
    </MedsenseScreen>
  );
};
