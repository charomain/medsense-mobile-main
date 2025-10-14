import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {InsightMedicationViewModel, useInsightsAPI} from './hooks';
import {useEffect} from 'react';
import {InsightInterval, PRNAdherenceDatum} from '@app/models/insights';
import {FlatList} from 'react-native';
import {OverallMedicationAdherence} from './OverallMedicationAdherence';
import {InsightMedicationRow} from './InsightMedicationRow';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {InsightsDateTimeSelector} from '@app/shared/Insights/InsightsDateTimeSelector';
import {InsightsStackScreenProps} from '../types';
import {BackButton} from '@app/components/BackButton';
import {usePatientContext} from '@app/contexts/patient';
import {PRNInsightRow} from './PRNInsightRow';
import {Medication} from '@app/models/medication';
import {ListToggle} from '@app/components/ListToggle';
import {
  InsightsDataType,
  INSIGHT_DATA_TYPE_OPTIONS,
  INSIGHT_DATA_TYPE_OPTION_LABELs,
  isClinicalProgramRow,
} from './types';
import {ProgramRow} from './ProgramRow';
import {UserProgramEnrollment} from '@app/models/program';
type InsightsScreenProps = InsightsStackScreenProps<'InsightsMain'>;

const copy = {
  title: 'Insights',
};

export const InsightsMainScreen: React.FC<InsightsScreenProps> = ({
  navigation,
}) => {
  const patientProfile = usePatientContext();

  const [interval, setInterval] = React.useState<InsightInterval>(
    InsightInterval.daily,
  );

  const [dataType, setDataType] = React.useState<InsightsDataType>(
    'adherence-and-programs',
  );

  const {
    adherenceData,
    currentAPIPeriod,
    apiPeriods,
    selectAPIPeriod,
    fetchPeriods,
    loading,
    programs,
  } = useInsightsAPI();
  useEffect(() => {
    fetchPeriods(interval, 7, new Date());
    // fetchAdherenceForAPIPeriod(new Date(Date.now() - (1000 * 86400 * 7)), new Date());
  }, [fetchPeriods, interval]);

  const onPressMedication = React.useCallback(
    (model: InsightMedicationViewModel) => {
      if (model.medication?.id) {
        navigation.push('InsightsDetail', {
          medication: model.medication!,
          interval,
          startDate: currentAPIPeriod?.startDate!,
          endDate: currentAPIPeriod?.endDate!,
        });
      }
    },
    [navigation, currentAPIPeriod, interval],
  );

  const onPressPRNMedication = React.useCallback(
    (model: Medication, prnData: PRNAdherenceDatum[]) => {
      navigation.push('PRNInsightDetailScreen', {
        medication: model,
        events: prnData,
      });
    },
    [navigation],
  );

  const onPressOverall = React.useCallback(() => {
    navigation.push('InsightsDetail', {
      interval,
      startDate: currentAPIPeriod?.startDate!,
      endDate: currentAPIPeriod?.endDate!,
    });
  }, [navigation, currentAPIPeriod, interval]);

  const data = React.useMemo(() => {
    if (!programs || !adherenceData) {
      return undefined;
    }

    const showAdherenceData =
      dataType === 'adherence' || dataType === 'adherence-and-programs';
    const showPrograms =
      dataType === 'programs' || dataType === 'adherence-and-programs';

    return {
      listData: [
        ...(showAdherenceData ? adherenceData.medicationAdherence : []),
        ...(showAdherenceData ? adherenceData.prnData.values() : []),
        ...(showPrograms ? programs : []),
      ],
      adherencePercentage: adherenceData.overallAdherencePercentage,
    };
  }, [programs, adherenceData, dataType]);

  const onPressProgram = React.useCallback(
    (program: UserProgramEnrollment) => {
      navigation.push('ProgramDetailScreen', {
        program,
        interval,
        startDate: currentAPIPeriod?.startDate!,
        endDate: currentAPIPeriod?.endDate!,
      });
    },
    [navigation, interval, currentAPIPeriod],
  );

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <ScreenLogoHeader />
      {patientProfile && <BackButton onPress={() => navigation.goBack()} />}
      <MedsenseText align="center" size="h1">
        {copy.title}
      </MedsenseText>
      <FlatList
        ListHeaderComponent={
          <>
            <InsightsDateTimeSelector
              interval={interval}
              onChangeInterval={setInterval}
              apiPeriod={currentAPIPeriod}
              apiPeriods={apiPeriods}
              onChangeAPIPeriod={selectAPIPeriod}
            />
            <ListToggle<InsightsDataType>
              label="Data Type"
              selectedValues={dataType}
              onPressOption={setDataType}
              options={INSIGHT_DATA_TYPE_OPTIONS}
              getLabelForOption={d => INSIGHT_DATA_TYPE_OPTION_LABELs[d]}
              getKeyForOption={d => d}
              closeOnSelect={true}
              style={margin('bottom', 'p2')}
            />
            {data && (
              <OverallMedicationAdherence
                style={margin('bottom', 'p1')}
                adherencePercentage={data.adherencePercentage}
                onPressOverall={onPressOverall}
              />
            )}
          </>
        }
        data={data ? data.listData : []}
        renderItem={({item}) =>
          isClinicalProgramRow(item) ? (
            <ProgramRow
              onPress={onPressProgram}
              style={margin('bottom', 'p1')}
              item={item}
            />
          ) : !Array.isArray(item) ? (
            <InsightMedicationRow
              onPress={onPressMedication}
              style={margin('bottom', 'p1')}
              model={item}
            />
          ) : (
            <PRNInsightRow
              model={item}
              onPress={onPressPRNMedication}
              style={margin('bottom', 'p1')}
            />
          )
        }
      />
    </MedsenseScreen>
  );
};
