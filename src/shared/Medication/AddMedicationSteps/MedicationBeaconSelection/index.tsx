import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationViewModel} from '../../model';
import {FreeBeaconModel, getBeaconLabel} from '@app/models/beacon';
import {
  ListToggleContainer,
  ListToggleLabel,
} from '@app/shared/components/ListToggle/ListToggleContainer';
import {ListToggleRow} from '@app/shared/components/ListToggle/ListToggleRow';
import {MedsenseText} from '@app/components/Text';
import {View} from 'react-native';
import {useTheme} from '@app/contexts/theme';
import {BeaconColorCircle} from '@app/shared/Medication/AddMedicationSteps/components/BeaconColorCircle';

type MedicationBeaconSelectionProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
  freeBeacons: FreeBeaconModel[];
};

const copy = {
  heading: 'Medication Sensor',
  subheading:
    'Please select what sensor you would like to use for this medication. ' +
    'This will be the sensor you attach to this medication container.',
  nameLabel: 'Medication sensor',
};

type BeaconRowProps = {
  beacon: FreeBeaconModel;
  onPress(beacon: FreeBeaconModel): void;
  selected: boolean;
};

const BeaconRow: React.FC<BeaconRowProps> = ({onPress, selected, beacon}) => {
  const theme = useTheme();
  const onPressWrapped = React.useCallback(() => {
    onPress(beacon);
  }, [beacon, onPress]);

  return (
    <ListToggleRow onPress={onPressWrapped} selected={selected}>
      <BeaconColorCircle beacon={beacon} />
      <View style={margin('left', 'p1')}>
        <MedsenseText
          style={{
            color: selected
              ? theme.accentColor
              : theme.screens.primary.textColor,
          }}>
          {getBeaconLabel(beacon)}
        </MedsenseText>
      </View>
    </ListToggleRow>
  );
};

export const MedicationBeaconSelection: React.FC<
  MedicationBeaconSelectionProps
> = ({onPressBack, onPressNext, medication, freeBeacons}) => {
  const [beacon, setBeacon] = React.useState(medication.beacon);
  const onPressNextWrapped = React.useCallback(() => {
    onPressNext({
      ...medication,
      beacon,
    });
  }, [onPressNext, beacon, medication]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={!beacon}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <ListToggleContainer
        style={standardFormElementSpacing()}
        onPress={console.log}>
        <ListToggleLabel label={copy.nameLabel} />
        <MedsenseText style={margin('bottom', 'p3')} muted={true}>
          {beacon ? getBeaconLabel(beacon) : 'Select a sensor'}
        </MedsenseText>
        {freeBeacons.map(b => (
          <BeaconRow
            key={b.beaconId}
            selected={b.beaconId === beacon?.beaconId}
            beacon={b}
            onPress={setBeacon}
          />
        ))}
      </ListToggleContainer>
    </MedicationFormCard>
  );
};
