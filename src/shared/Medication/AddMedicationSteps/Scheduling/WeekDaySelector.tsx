import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import * as React from 'react';
import {ScheduleFrequencyInterval} from '../../model';
import {WeekDay} from '@app/models/medication';
import {MedsenseText} from '@app/components/Text';

const copy = {
  weekdayIntro:
    'Please select what what days of the week do you take this medication.',

  weekdayLabel: 'Days',
  weekdayEmptyText: 'Select when you take medication...',
};

const WEEKDAY_LABELS: Record<WeekDay, string> = {
  sun: 'Sundays',
  mon: 'Mondays',
  tue: 'Tuesdays',
  wed: 'Wednesdays',
  thu: 'Thursdays',
  fri: 'Fridays',
  sat: 'Saturdays',
};

const ALL_WEEKDAYS: WeekDay[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

type WeekDaySelectorProps = {
  selected: WeekDay[];
  setScheduleFrequencyInterval(interval: ScheduleFrequencyInterval): void;
};

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selected,
  setScheduleFrequencyInterval,
}) => {
  const onPressOption = React.useCallback(
    (weekDay: WeekDay) => {
      if (selected.includes(weekDay)) {
        setScheduleFrequencyInterval({
          type: 'specific-days',
          days: selected.filter(w => w !== weekDay),
        });
      } else {
        setScheduleFrequencyInterval({
          type: 'specific-days',
          days: selected.concat(weekDay),
        });
      }
    },
    [selected, setScheduleFrequencyInterval],
  );

  return (
    <>
      <MedsenseText style={margin('bottom', 'p3')}>
        {copy.weekdayIntro}
      </MedsenseText>
      <ListToggle<WeekDay>
        label={copy.weekdayLabel}
        emptyText={copy.weekdayEmptyText}
        selectedValues={selected}
        getKeyForOption={t => t}
        getLabelForOption={t => WEEKDAY_LABELS[t]}
        options={ALL_WEEKDAYS}
        onPressOption={onPressOption}
        style={standardFormElementSpacing()}
      />
    </>
  );
};
