import {padding} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {MoreStackScreenProps} from '../types';
import {SettingsRow} from '@app/shared/components/SettingsRow';
import {SettingsDestructiveRow} from '@app/components/SettingsDestructiveRow';
import {useSignOut} from '@app/stores/auth';
import {useContext} from 'react';
import {ThemeContext} from '@app/contexts/theme';
// import {Alert, NativeModules} from 'react-native';
import {ScrollView} from 'react-native';

type MoreScreenProps = MoreStackScreenProps<'Menu'>;
// type MoreScreenProps = MoreStackScreenProps;

const copy = {
  title: 'Menu',
  signOut: 'Sign Out',
};

export const MoreScreen: React.FC<MoreScreenProps> = ({navigation}) => {
  const signOut = useSignOut();
  const themeContext = useContext(ThemeContext);

  // const onPressResetHub = () => {
  //   NativeModules.RNBeaconManager.resetHub();
  //   Alert.alert(
  //     'Now broadcasting',
  //     'The device is now broadcasting as the "S99999" with a UDID of "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0".',
  //   );
  // };

  return (
    <MedsenseScreen includeSpacing={true}>
      <MedsenseText style={padding('top', 'p3')} align="center" size="h1">
        {copy.title}
      </MedsenseText>
      <ScrollView>
        <SettingsRow
          title="My Medications"
          icon="pill"
          onPress={() =>
            navigation.navigate('Medications', {screen: 'MedicationList'})
          }
        />
        <SettingsRow
          title="Clinical Programs"
          icon="pill"
          onPress={() => navigation.push('Programs')}
        />
        <SettingsRow
          title="Care Portal"
          icon="care-portal"
          onPress={() => navigation.navigate('CarePortal', {screen: 'Landing'})}
        />
        <SettingsRow
          title="Insights"
          icon="graph"
          onPress={() =>
            navigation.navigate('Insights', {screen: 'InsightsMain'})
          }
        />
        <SettingsRow
          title="My Caregivers"
          icon="care-givers"
          onPress={() => navigation.push('MyCareGivers')}
        />
        <SettingsRow
          title="Notifications"
          icon="notifications"
          onPress={() => navigation.push('Notifications')}
        />
        <SettingsRow
          title="My Account"
          icon="gear"
          onPress={() => navigation.push('Account', {screen: 'EditProfile'})}
        />
        <SettingsRow
          title="Hub Setup"
          icon="notifications"
          onPress={() => navigation.push('Hub')}
        />
        <SettingsRow
          title="Hardware Status"
          icon="notifications"
          onPress={() => navigation.push('HardwareStatus')}
        />
        <SettingsRow
          title="Organization Enrollment"
          icon="gear"
          onPress={() => navigation.push('OrganizationEnrollment')}
        />
        {/* <SettingsRow
          title="Reset Hub (start broadcasting as beacon)"
          icon="notifications"
          onPress={() => onPressResetHub()}
        /> */}

        <SettingsRow
          title={
            themeContext?.themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'
          }
          icon="gear"
          onPress={() =>
            themeContext?.setThemeMode(
              themeContext?.themeMode === 'dark' ? 'light' : 'dark',
            )
          }
        />
        <SettingsDestructiveRow title={copy.signOut} onPress={signOut} />
      </ScrollView>
    </MedsenseScreen>
  );
};
