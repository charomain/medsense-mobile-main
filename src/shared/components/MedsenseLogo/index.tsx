import {useTheme} from '@app/contexts/theme';
import * as React from 'react';
import {MedsenseIcon} from '../Icon';

export const MedsenseLogo: React.FC<React.PropsWithChildren<{}>> = () => {
  const theme = useTheme();
  return (
    <MedsenseIcon
      size={{height: 30}}
      icon={theme.logoIconName}
      color={theme.accentColor}
    />
  );
};
