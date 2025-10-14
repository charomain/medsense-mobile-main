import * as React from 'react';
import {MoreStackScreenProps} from './types';
import {ProgramsScreen as ProgramsBaseScreen} from '@app/shared/Programs/ProgramsScreen';

type ProgramsScreenProps = MoreStackScreenProps<'Programs'>;

export const ProgramsScreen: React.FC<ProgramsScreenProps> = ({}) => {
  return <ProgramsBaseScreen />;
};
