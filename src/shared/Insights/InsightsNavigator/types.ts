import {InsightInterval, PRNAdherenceDatum} from '@app/models/insights';
import {Medication} from '@app/models/medication';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClinicalProgram} from './InsightsMainScreen/types';

export type InsightsStackParamList = {
  InsightsMain: undefined;
  InsightsDetail: {
    medication?: Medication;
    interval: InsightInterval;
    startDate: Date;
    endDate: Date;
  };
  PRNInsightDetailScreen: {
    medication: Medication;
    events: PRNAdherenceDatum[];
  };
  ProgramDetailScreen: {
    program: ClinicalProgram;
    interval: InsightInterval;
    startDate: Date;
    endDate: Date;
  };
};

export type InsightsStackScreenProps<
  ScreenName extends keyof InsightsStackParamList,
> = NativeStackScreenProps<InsightsStackParamList, ScreenName>;
