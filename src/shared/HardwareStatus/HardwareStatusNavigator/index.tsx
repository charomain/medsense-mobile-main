import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HardwareStatusParamList} from './types';
import {HardwareStatusLandingScreen} from './HardwareStatusLandingScreen';
import {HardwareSensorsListScreen} from './HardwareSensorsListScreen';

const HardwareStatusStack =
  createNativeStackNavigator<HardwareStatusParamList>();

export const HardwareStatusNavigator = () => {
  return (
    <HardwareStatusStack.Navigator screenOptions={{headerShown: false}}>
      <HardwareStatusStack.Screen
        name="Landing"
        component={HardwareStatusLandingScreen}
      />
      <HardwareStatusStack.Screen
        name="HardwareSensorsList"
        component={HardwareSensorsListScreen}
      />
    </HardwareStatusStack.Navigator>
  );
};
