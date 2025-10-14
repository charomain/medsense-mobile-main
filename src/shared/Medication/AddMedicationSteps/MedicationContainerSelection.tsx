import {margin} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationContainer} from '@app/models/medication';
import {MedicationViewModel} from '../model';
import {Pressable} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {NormalizedBeaconSet} from '@app/models/beacon';

type MedicationContainerSelectionProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
  onPressScanMore(): void;
  containerTypes: MedicationContainer[];
  beaconSets: NormalizedBeaconSet[];
};

const copy = {
  heading: 'What container type is this medication in?',
  subheading:
    'Below you can select what container type you use with this medication.',
  selectLabel: 'Select container type',
  selectOrganizerLabel: 'Select pill organizer',
};

export const MedicationContainerSelection: React.FC<
  MedicationContainerSelectionProps
> = ({
  onPressBack,
  onPressNext,
  onPressScanMore,
  containerTypes,
  medication,
  beaconSets,
}) => {
  const [selectedContainer, setSelectedContainer] =
    React.useState<MedicationContainer | null>(medication.container);
  const [selectedOrganizers, setSelectedOrganiers] = React.useState(
    medication.organizers,
  );

  const onPressNextWrapped = React.useCallback(() => {
    if (selectedContainer) {
      onPressNext({
        ...medication,
        container: selectedContainer,
        organizers: selectedOrganizers,
      });
    }
  }, [selectedContainer, selectedOrganizers, onPressNext, medication]);

  const isPillOrganizerSelected = React.useMemo(() => {
    return selectedContainer?.isPillOrganizer ?? false;
  }, [selectedContainer]);

  const canMoveForward = React.useMemo(() => {
    if (!selectedContainer) {
      return false;
    }

    if (selectedContainer.isPillOrganizer && !selectedOrganizers?.length) {
      return false;
    }

    return true;
  }, [selectedContainer, selectedOrganizers]);

  const onSelectOrganizer = React.useCallback(
    (organizer: NormalizedBeaconSet) => {
      if (selectedOrganizers?.some(o => o.id === organizer.id)) {
        setSelectedOrganiers(
          selectedOrganizers?.filter(o => o.id !== organizer.id),
        );
      } else {
        setSelectedOrganiers((selectedOrganizers ?? []).concat(organizer));
      }
    },
    [selectedOrganizers, setSelectedOrganiers],
  );

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={!canMoveForward}
      belowButtonsContent={
        <Pressable onPress={onPressScanMore} style={margin('top', 'p4')}>
          <MedsenseText flavor="accent" align="center">
            Scan Additional QR Codes
          </MedsenseText>
        </Pressable>
      }
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      <ListToggle<MedicationContainer>
        label={copy.selectLabel}
        selectedValues={selectedContainer ? [selectedContainer] : []}
        options={containerTypes}
        getLabelForOption={container => container.name}
        getKeyForOption={container => `${container.id}`}
        emptyText="Tap to see options..."
        onPressOption={setSelectedContainer}
        style={margin('bottom', 'p2')}
        closeOnSelect={true}
      />
      {isPillOrganizerSelected && (
        <ListToggle<NormalizedBeaconSet>
          label={copy.selectOrganizerLabel}
          selectedValues={selectedOrganizers ?? null}
          options={beaconSets}
          getLabelForOption={beaconSet => beaconSet.name}
          getKeyForOption={beaconSet => `${beaconSet.id}`}
          emptyText="Tap to see options..."
          onPressOption={onSelectOrganizer}
          style={margin('bottom', 'p2')}
          closeOnSelect={true}
        />
      )}
    </MedicationFormCard>
  );
};
