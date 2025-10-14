import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import {ListToggle} from '@app/components/ListToggle';
import * as React from 'react';
import {ScheduleFrequencyInterval} from '../../model';
import {MedsenseText} from '@app/components/Text';

const copy = {
  weekdayIntro: 'Please select what interval of time you take this medication.',

  weekdayLabel: 'Interval',
  weekdayEmptyText: 'Select when you take medication...',
};

const RECURRING_OPTIONS = [
  {
    repeatDay: 2,
    label: 'Every 2 Days',
  },
  {
    repeatDay: 3,
    label: 'Every 3 Days',
  },
  {
    repeatDay: 4,
    label: 'Every 4 Days',
  },
  {
    repeatDay: 5,
    label: 'Every 5 Days',
  },
  {
    repeatDay: 6,
    label: 'Every 6 Days',
  },
  {
    repeatDay: 7,
    label: 'Every 7 Days',
  },
  {
    repeatDay: 8,
    label: 'Every 8 Days',
  },
];

type RecurringFrequencySelectorProps = {
  selected: number[];
  setScheduleFrequencyInterval(interval: ScheduleFrequencyInterval): void;
};

const RECURRING_DAY_OPTIONS = RECURRING_OPTIONS.map(o => o.repeatDay);
const RECURRING_DAY_LABELS = RECURRING_OPTIONS.reduce((accum, o) => {
  accum[o.repeatDay] = o.label;
  return accum;
}, {} as Record<number, string>);

export const RecurringFrequencySelector: React.FC<
  RecurringFrequencySelectorProps
> = ({selected, setScheduleFrequencyInterval}) => {
  const onPressOption = React.useCallback(
    (interval: number) => {
      if (selected.includes(interval)) {
        setScheduleFrequencyInterval({
          type: 'recurring-interval',
          intervals: selected.filter(w => w !== interval),
        });
      } else {
        setScheduleFrequencyInterval({
          type: 'recurring-interval',
          intervals: selected.concat(interval),
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
      <ListToggle<number>
        label={copy.weekdayLabel}
        emptyText={copy.weekdayEmptyText}
        selectedValues={selected}
        getKeyForOption={t => t}
        getLabelForOption={t => RECURRING_DAY_LABELS[t]}
        options={RECURRING_DAY_OPTIONS}
        onPressOption={onPressOption}
        style={standardFormElementSpacing()}
      />
    </>
  );
};
