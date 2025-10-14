import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HubStackParamList} from './types';
import {HubSetupIntroScreen} from './HubSetupIntroScreen';
import {CellHubSetupScreen} from './CellHubSetupScreen';
import {HomeWifiConfirmationScreen} from './HomeWifiConfirmationScreen';
import {HomeWifiPasswordScreen} from './HomeWifiPasswordScreen';
import {PlugInHubSetupScreen} from './PlugInHubSetupScreen';
import {HubSetupScreen} from './HubSetupScreen';
import {HubSetupCompleteScreen} from './HubSetupComplete';
import {HubSetupConfirmCompleteScreen} from './HubSetupConfirmComplete';

const HubStack = createNativeStackNavigator<HubStackParamList>();

export const HubNavigator = () => {
  return (
    <HubStack.Navigator screenOptions={{headerShown: false}}>
      <HubStack.Screen name="Intro" component={HubSetupIntroScreen} />
      <HubStack.Screen name="CellHubSetup" component={CellHubSetupScreen} />
      <HubStack.Screen
        name="HomeWifiConfirmation"
        component={HomeWifiConfirmationScreen}
      />
      <HubStack.Screen
        name="HomeWifiPassword"
        component={HomeWifiPasswordScreen}
      />
      <HubStack.Screen name="PlugInHubSetup" component={PlugInHubSetupScreen} />
      <HubStack.Screen name="HubSetup" component={HubSetupScreen} />
      <HubStack.Screen
        name="HubSetupComplete"
        component={HubSetupCompleteScreen}
      />
      <HubStack.Screen
        name="HubSetupConfirmComplete"
        component={HubSetupConfirmCompleteScreen}
      />
    </HubStack.Navigator>
  );
};
