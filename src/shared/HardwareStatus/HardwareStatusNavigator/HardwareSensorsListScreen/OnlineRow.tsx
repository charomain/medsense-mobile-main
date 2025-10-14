import * as React from 'react';
import {ConnectivityStatusCircle} from '@app/shared/Beacons/ConnectivityStatusCircle';
import {StyleSheet, View} from 'react-native';
import {MedsenseText, MedsenseTextStyle} from '@app/components/Text';

type OnlineRowProps = {
  isOnline: boolean;
  textStyle: MedsenseTextStyle;
};

export const OnlineRow: React.FC<OnlineRowProps> = ({textStyle, isOnline}) => {
  return (
    <View style={styles.self}>
      <ConnectivityStatusCircle isOnline={isOnline} />
      <MedsenseText style={[textStyle]}>
        {isOnline ? 'Online' : 'Offline'}
      </MedsenseText>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
