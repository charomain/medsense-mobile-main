import {margin} from '@app/appearance/layout';
import {MedsenseText} from '@app/components/Text';
import {HubFailureResult} from '@app/services/hub';
import * as React from 'react';

type FailureMessageProps = {
  result: HubFailureResult | null;
};

export const FailureMessage: React.FC<FailureMessageProps> = ({result}) => {
  if (!result) {
    return null;
  }

  return (
    <>
      <MedsenseText flavor="danger" style={margin('bottom', 'p2')}>
        Sorry, something wrong configuring your hub.
      </MedsenseText>
      <MedsenseText style={margin('bottom', 'p2')}>
        Diagonistic Info:
      </MedsenseText>
      <MedsenseText style={margin('bottom', 'p2')}>
        Error message: {result.error.message}
      </MedsenseText>
      <MedsenseText style={margin('bottom', 'p2')}>
        Last step sent: {result.lastCommandFriendlyName}
      </MedsenseText>
    </>
  );
};
