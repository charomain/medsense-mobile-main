import * as React from 'react';
import {margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {format} from 'date-fns';

type DateRowProps = {
  startDate: Date;
  endDate: Date;
};

const DATE_FORMAT = 'M/d';

export const DateRow: React.FC<DateRowProps> = ({startDate, endDate}) => {
  return (
    <MedsenseText style={margin('bottom', 'p2')} muted={true}>
      {startDate && format(startDate, DATE_FORMAT)} -{' '}
      {endDate && format(endDate, DATE_FORMAT)}
    </MedsenseText>
  );
};
