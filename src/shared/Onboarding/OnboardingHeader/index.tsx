import * as React from 'react';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {TenantContext} from '@app/contexts/tenant';

type OnboardingHeaderProps = {
  onPressBack?(): void;
};

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onPressBack,
}) => {
  const tenantContext = React.useContext(TenantContext);
  const copy = React.useMemo(() => {
    if (tenantContext?.tenant === 'toothcase') {
      return {
        header: 'Welcome to Toothcase',
        subheader: 'Appliances Made Easy',
      };
    } else {
      return {
        header: 'Welcome to Medsense',
        subheader: 'Medications Made Easy',
      };
    }
  }, [tenantContext]);

  return (
    <>
      <ScreenLogoHeader onPressBack={onPressBack} />
      <ScreenTextHeading title={copy.header} subtitle={copy.subheader} />
    </>
  );
};
