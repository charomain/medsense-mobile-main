import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type PRNCircleProps = {
  events: number;
  size: number;
  color: string;
};

export const PRNCircle: React.FC<PRNCircleProps> = ({events, size, color}) => {
  return (
    <View style={{width: size, height: size}}>
      <View style={[StyleSheet.absoluteFill, styles.self]}>
        <View style={styles.textOverlay}>
          <MedsenseText style={{color}} size="h3">
            {events}
          </MedsenseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  self: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
