import {PRNAdherenceDatum} from '@app/models/insights';
import {InsightMedicationViewModel} from './hooks';
import {UserProgramEnrollment} from '@app/models/program';

export type InsightsDataType =
  | 'adherence-and-programs'
  | 'adherence'
  | 'programs';

// export type InsightsDataTypeOption = {
//   type: InsightsDataType,
//   label: string,
// }

// export const INSIGHT_DATA_TYPE_OPTIONS: InsightsDataTypeOption[] = [
//   {
//     type: 'adherence-and-programs',
//     label: 'Adherence and Programs'
//   },
//   {
//     type: 'adherence',
//     label: 'Adherence'
//   },
//   {
//     type: 'programs',
//     label: 'Programs'
//   },
// ]
export const INSIGHT_DATA_TYPE_OPTION_LABELs: Record<InsightsDataType, string> =
  {
    'adherence-and-programs': 'Adherence and Programs',
    adherence: 'Adherence',
    programs: 'Programs',
  };

export const INSIGHT_DATA_TYPE_OPTIONS: InsightsDataType[] = [
  'adherence-and-programs',
  'adherence',
  'programs',
];

// medicationAdherence: InsightMedicationViewModel[];
// prnData: PRNDataByMedication;
export const isClinicalProgramRow = (
  item:
    | UserProgramEnrollment
    | PRNAdherenceDatum[]
    | InsightMedicationViewModel,
): item is UserProgramEnrollment => {
  return (
    !Array.isArray(item) &&
    (item as UserProgramEnrollment).careProgramId !== undefined
  );
};
