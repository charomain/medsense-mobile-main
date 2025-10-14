import * as React from 'react';
import {HardwareStatusScreenProps} from '../types';
import {Screen} from './Screen';
import {useMedicationsAPI} from './hooks';

type HardwareSensorsListScreenProps =
  HardwareStatusScreenProps<'HardwareSensorsList'>;

export const HardwareSensorsListScreen: React.FC<
  HardwareSensorsListScreenProps
> = ({navigation}) => {
  const beaconsAPI = useMedicationsAPI();
  return <Screen {...beaconsAPI} onPressBack={() => navigation.goBack()} />;
};
