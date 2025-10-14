import {margin} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {ScrollView} from 'react-native';
import {useHardwareStatusAPI} from './hooks';
import {HubCard} from './HubCard';
import {SensorsCard} from './SensorsCard';

type ScreenProps = {
  onPressBack(): void;
  onPressViewAllSensors(): void;
};

const copy = {
  heading: 'Hardware Status',
};

export const Screen: React.FC<ScreenProps> = ({
  onPressBack,
  onPressViewAllSensors,
}) => {
  const {loading, data} = useHardwareStatusAPI();

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={onPressBack}
        title={copy.heading}
        subtitle={null}
      />
      <ScrollView>
        <HubCard hubs={data?.hubs ?? []} />
        <SensorsCard
          onPressViewAll={onPressViewAllSensors}
          style={margin('top', 'p3')}
          isOnline={data?.beaconsOnline}
        />
      </ScrollView>
    </MedsenseScreen>
  );
};
