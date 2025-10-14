import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MoreScreen} from './MenuScreen';
import {MoreStackParamList} from './types';
import {AccountNavigator} from '@app/shared/Account/AccountNavigator';
import {NotificationsScreen} from './NotificationsScreen';
import {MyCareGiversScreen} from './MyCareGiversScreen';
import {InviteCareGiverForMe} from './InviteCareGiverForMe';
import {HardwareStatusNavigator} from '@app/shared/HardwareStatus/HardwareStatusNavigator';
import {HubNavigator} from '@app/shared/Hub/HubNavigator';
import {OrganizationEnrollment} from '@app/shared/Account/OrganizationEnrollment';
import {ProgramsScreen} from './ProgramsScreen';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();

export const MoreNavigator = () => {
  return (
    <MoreStack.Navigator
      initialRouteName="Menu"
      screenOptions={{headerShown: false}}>
      <MoreStack.Screen name="Menu" component={MoreScreen as any} />
      <MoreStack.Screen name="Account" component={AccountNavigator} />
      <MoreStack.Screen
        name="Notifications"
        component={NotificationsScreen as any}
      />
      <MoreStack.Screen name="MyCareGivers" component={MyCareGiversScreen} />
      <MoreStack.Screen name="Hub" component={HubNavigator} />
      <MoreStack.Screen
        name="InviteCareGiverForMe"
        component={InviteCareGiverForMe}
      />
      <MoreStack.Screen
        name="HardwareStatus"
        component={HardwareStatusNavigator}
      />
      <MoreStack.Screen
        name="OrganizationEnrollment"
        component={OrganizationEnrollment}
      />
      <MoreStack.Screen name="Programs" component={ProgramsScreen} />
    </MoreStack.Navigator>
  );
};
