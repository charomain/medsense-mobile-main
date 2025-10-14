import {useAuthStore} from '@app/stores/auth';
import * as React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

type DevInfoProps = {};

export const DevInfo: React.FC<DevInfoProps> = ({}) => {
  const {isInitializing, isLoggedIn, profile} = useAuthStore();
  return (
    <ScrollView style={styles.self}>
      <Text style={styles.heading}>DEV</Text>
      <Text>
        {JSON.stringify({isInitializing, isLoggedIn, profile}, null, 2)}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  self: {
    marginTop: 50,
    height: 200,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
