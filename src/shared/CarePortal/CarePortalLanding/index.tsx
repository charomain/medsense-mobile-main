import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {margin} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {CarePortalProfileRow} from './CarePortalRow';
import {AccessibleUserProfile} from '@app/models/profile';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {FloatingButton} from '@app/components/FloatingButton';
import {useCarePortalLandingAPI} from './hooks';
import {PendingPatientsSection} from './PendingPatientsSection';

type CarePortalLandingProps = {
  onPressCreateAccount(): void;
  onPressProfile(profile: AccessibleUserProfile): void;
};

const copy = {
  heading: 'Care Portal',
  subtitle: 'Your Caregiver Account',
  yourPatients: 'Your Patients',
  searchPlaceholder: 'Search your patients...',
  actions: {
    createNewAccount: 'Add Someone You Care For',
    giveAnotherUserAccess: 'Give Another User Access To Your Account',
  },
};

export const CarePortalLanding: React.FC<CarePortalLandingProps> = ({
  onPressCreateAccount,
  onPressProfile,
}) => {
  const {
    loading,
    patients,
    pendingPatients,
    acceptSharingFrom,
    rejectSharingFrom,
  } = useCarePortalLandingAPI();

  return (
    <MedsenseScreen includeSpacing={true} showLoadingOverlay={loading}>
      <ScreenLogoHeader />
      <ScreenTextHeading title={copy.heading} subtitle={copy.subtitle} />
      <ScrollView>
        <PendingPatientsSection
          patients={pendingPatients}
          onAccept={acceptSharingFrom}
          onIgnore={rejectSharingFrom}
        />
        <MedsenseText
          style={margin('bottom', 'p3')}
          weight="bold"
          align="center">
          {copy.yourPatients}
        </MedsenseText>
        {/* <SearchBar
          style={margin('vertical', 'p3')}
          onPressSearch={console.log}
          placeholder={copy.searchPlaceholder}
        /> */}
        <View style={styles.content}>
          {(patients ?? []).map(item => (
            <CarePortalProfileRow
              style={margin('bottom', 'p2')}
              item={item}
              onPress={onPressProfile}
              key={item.id}
            />
          ))}
        </View>
      </ScrollView>
      <FloatingButton.Container>
        <FloatingButton onPress={onPressCreateAccount}>
          {copy.actions.createNewAccount}
        </FloatingButton>
      </FloatingButton.Container>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {},
});
