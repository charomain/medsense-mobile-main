import {Colors} from '@app/appearance/colors';
import {MedicationStatisticPeriod, Medication} from '@app/models/medication';
import {ColorTypeModel} from '@app/models/beacon';

export enum InsightInterval {
  daily,
  weekly,
  monthly,
}

export type AdherenceMedication = {
  name: string;
  color: ColorTypeModel | null;
  date: Date;
  time: Date;
  actualTime: Date;
};

const adherenceMedicationFromMedication = (
  medication: Medication,
  statisticPeriod: MedicationStatisticPeriod,
): AdherenceMedication => {
  return {
    name: medication.name,
    color: medication.colorType,
    date: statisticPeriod.date,
    time: statisticPeriod.time,
    actualTime: statisticPeriod.actualTime,
  };
};

export type AdherenceDataForDate = {
  date: Date;
  missedData: AdherenceMedication[];
  takenData: AdherenceMedication[];
};

const sortComparatorForObjectWithDate = <T extends {date: Date}>(
  o1: T,
  o2: T,
): number => {
  return o1.date.getTime() - o2.date.getTime();
};

const pushMedicationOnAdherenceDataForDate = (
  adherenceDataForDate: AdherenceDataForDate,
  medication: Medication,
  statisticPeriod: MedicationStatisticPeriod,
) => {
  const convertedMedication = adherenceMedicationFromMedication(
    medication,
    statisticPeriod,
  );
  if (statisticPeriod.status === 'fail') {
    adherenceDataForDate.missedData.push(convertedMedication);
  } else {
    adherenceDataForDate.takenData.push(convertedMedication);
  }
};

export const convertMedicationListResponseToAdherenceData = (
  medications: Medication[],
): AdherenceDataForDate[] => {
  /*
    This is from the original app - using the same strategy here (for now)
    statisticMedicaments.forEach { (medicament) in
        medicament.statisticPeriods?.forEach({ (statisticPeriod) in

            if let index = objects.firstIndex(where: { $0.date == statisticPeriod.date }) {

                objects[index].addData(medicament: medicament, statisticPeriod: statisticPeriod)

            } else {

                let adherenceDate = AdherenceDateModel(date: statisticPeriod.date)
                adherenceDate.addData(medicament: medicament, statisticPeriod: statisticPeriod)
                objects.append(adherenceDate)

            }

        })
    }

    objects.forEach { (adherenceDate) in

        adherenceDate.missedData.sort(by: { (data1, data2) -> Bool in
            return data1.time < data2.time
        })

        adherenceDate.takenData.sort(by: { (data1, data2) -> Bool in
            return data1.time < data2.time
        })

    }

  */
  const adherenceDataForDates = [] as AdherenceDataForDate[];
  for (let medication of medications) {
    if (medication.statisticPeriods) {
      for (let statisticPeriod of medication.statisticPeriods) {
        let matchingIndex = adherenceDataForDates.findIndex(
          o => o.date === statisticPeriod.date,
        );
        if (matchingIndex === -1) {
          const newAdherenceDataForDate: AdherenceDataForDate = {
            date: statisticPeriod.date,
            missedData: [],
            takenData: [],
          };

          adherenceDataForDates.push(newAdherenceDataForDate);

          matchingIndex = adherenceDataForDates.length - 1;
        }

        pushMedicationOnAdherenceDataForDate(
          adherenceDataForDates[matchingIndex],
          medication,
          statisticPeriod,
        );
      }
    }
  }

  adherenceDataForDates.forEach(adherenceDataForDate => {
    adherenceDataForDate.missedData.sort(sortComparatorForObjectWithDate);
    adherenceDataForDate.takenData.sort(sortComparatorForObjectWithDate);
  });

  adherenceDataForDates.sort(sortComparatorForObjectWithDate);

  return adherenceDataForDates;
};

export const getOverallTakePercentageFromAdherenceData = (
  adherenceData: AdherenceDataForDate[],
): number => {
  if (adherenceData.length === 0) {
    return 0;
  }

  const totalMissed = adherenceData.reduce(
    (accum, row) => accum + row.missedData.length,
    0,
  );
  const totalTaken = adherenceData.reduce(
    (accum, row) => accum + row.takenData.length,
    0,
  );

  return (totalTaken / (totalMissed + totalTaken)) * 100;
};

export type StatisticResponseModel = {
  startDate: Date | null;
  endDate: Date | null;
  percent: number;
  medication: Medication | null;
};

export type StatisticResponse = StatisticResponseModel[];

export type DoseEventType = 'taken' | 'missed';

export const colorForDoseEventType = (type: DoseEventType) => {
  return type === 'missed' ? Colors.missedRed : Colors.takenGreen;
};

export interface PRNAdherenceEvent {
  id: string;
  occurredAt: Date;
  userId: number;
  service: string;
  eventType: string;
  message: string;
  signature: string;
  severity: string;
  data: Data | null;
}

export interface Data {
  userId: number;
  beaconUUID: string;
  scheduleId?: null;
  medicamentId: number;
  medStatisticId?: null;
  scheduleTimeId?: null;
}

export interface PRNAdherenceDatum {
  id: string;
  occurredAt: Date;
  userId: number;
  service: string;
  eventType: string;
  message: string;
  signature: string;
  severity: string;
  medication: Medication;
}

export type PRNDataByMedication = Map<number, PRNAdherenceDatum[]>;

export const dosesForMedicationForDates = (
  medications: Medication[],
  data: PRNAdherenceEvent[],
): PRNDataByMedication => {
  const medById = new Map(medications.map(m => [m.id, m]));
  const doseEvents = data.reduce((accum, row) => {
    if (!row.data) {
      return accum;
    }

    const medication = medById.get(row.data.medicamentId);
    if (!medication) {
      return accum;
    }

    if (!accum.get(row.data.medicamentId)) {
      accum.set(row.data.medicamentId, []);
    }

    accum.get(row.data.medicamentId)!.push({
      id: row.id,
      occurredAt: row.occurredAt,
      userId: row.userId,
      service: row.service,
      eventType: row.eventType,
      message: row.message,
      signature: row.signature,
      severity: row.severity,
      medication,
    });

    return accum;
  }, new Map<number, PRNAdherenceDatum[]>());

  return doseEvents;
};
