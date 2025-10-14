import * as React from 'react';
import {HardwareStatusScreenProps} from '../types';
import {Screen} from './Screen';

type HardwareStatusLandingScreenProps = HardwareStatusScreenProps<'Landing'>;

export const HardwareStatusLandingScreen: React.FC<
  HardwareStatusLandingScreenProps
> = ({navigation}) => {
  return (
    <Screen
      onPressViewAllSensors={() => navigation.navigate('HardwareSensorsList')}
      onPressBack={() => navigation.goBack()}
    />
  );
};
