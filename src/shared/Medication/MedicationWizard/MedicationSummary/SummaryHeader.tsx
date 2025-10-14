import {MedsenseText} from '@app/components/Text';
import * as React from 'react';

type SummaryHeaderProps = React.PropsWithChildren<{}>;

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({children}) => {
  return <MedsenseText flavor="accent">{children}</MedsenseText>;
};
