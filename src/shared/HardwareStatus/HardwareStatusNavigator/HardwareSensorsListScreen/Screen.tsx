import {margin} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {ScrollView} from 'react-native';
import {SensorCard} from './SensorCard';
import {BeaconsAPI} from './hooks';

type ScreenProps = {
  onPressBack(): void;
} & BeaconsAPI;

const copy = {
  heading: 'Hardware Status',
};

export const Screen: React.FC<ScreenProps> = ({
  onPressBack,
  loading,
  beacons,
}) => {
  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={onPressBack}
        title={copy.heading}
        subtitle={null}
      />
      <ScrollView>
        <MedsenseText align="center" style={margin('bottom', 'p2')}>
          All Sensors
        </MedsenseText>
        {beacons && beacons.map(beacon => <SensorCard beacon={beacon} />)}
      </ScrollView>
    </MedsenseScreen>
  );
};
