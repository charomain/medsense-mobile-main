import * as React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {margin, padding} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedicationDetailCard} from '@app/shared/Medication/MedicationDetailCard';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {FloatingButton} from '@app/components/FloatingButton';
import {SearchBar} from '@app/components/SearchBar/index';
import {MedsenseText} from '@app/components/Text';
import {Medication} from '@app/models/medication';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubSetupAction} from '@app/shared/components/HubSetupAction';

type MedicationListProps = {
  onPressAdd(): void;
  onPressEdit(medication: Medication): void;
  title: string;
  subtitle: string;
  belowFoldTitle: string;
  onPressBack?(): void;
  onPressMedication?(medication: Medication): void;
  onPressSmartBoxAction?(
    medication: Medication,
    action: 'reload' | 'reset',
  ): void;
  medications?: Medication[];
  onPressSearch(query: string): void;
  loading: boolean;
  refetch(): void;
  onPressSetupHub(): void;
};

const copy = {
  addMedication: 'Add Medication',

  searchPlaceholder: 'Search your medications...',
};

export const MedicationList: React.FC<MedicationListProps> = ({
  onPressAdd,
  onPressEdit,
  title,
  subtitle,
  belowFoldTitle,
  onPressMedication,
  onPressBack,
  medications,
  onPressSearch,
  loading,
  refetch,
  onPressSetupHub,
  onPressSmartBoxAction,
}) => {
  return (
    <MedsenseScreen showLoadingOverlay={false} includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={onPressBack}
        title={title}
        subtitle={subtitle}
      />
      <HubSetupAction onPressView={() => onPressSetupHub()} />
      <MedsenseText weight="bold" align="center">
        {belowFoldTitle}
      </MedsenseText>
      <SearchBar
        onPressSearch={onPressSearch}
        placeholder={copy.searchPlaceholder}
        style={margin('vertical', 'p3')}
      />
      <FlatList
        contentContainerStyle={padding('bottom', 'p10')}
        data={medications ?? []}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        renderItem={({item}) => (
          <MedicationDetailCard
            onPressEdit={() => onPressEdit(item)}
            medication={item}
            style={margin('bottom', 'p1')}
            onPressSmartBoxAction={onPressSmartBoxAction}
            onPress={
              onPressMedication ? () => onPressMedication(item) : undefined
            }
          />
        )}
      />
      <FloatingButton.Container>
        <FloatingButton onPress={onPressAdd}>
          {copy.addMedication}
        </FloatingButton>
      </FloatingButton.Container>
    </MedsenseScreen>
  );
};
