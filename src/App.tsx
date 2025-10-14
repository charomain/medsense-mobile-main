import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainNavigator, OnboardingNavigator} from './screens';
import {
  AuthenticationProvider,
  useAuthenticationStatus,
} from '@app/stores/auth';
import {ThemeProvider} from '@app/stores/theme';
import {HubSettingsProvider} from '@app/stores/hub';
import {ITenantContext, TenantContext} from '@app/contexts/tenant';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {ActivityIndicator, Linking, StyleSheet, View} from 'react-native';
import {lightTheme, darkTheme} from '@app/appearance/themes';
import {WifiSettingsProvider} from './stores/wifi';

const handleNotification = (
  notification: FirebaseMessagingTypes.RemoteMessage,
) => {
  if (notification.data?.BROWSER_OPEN_URL) {
    Linking.openURL(notification.data?.BROWSER_OPEN_URL);
  }
};

const RootNavigator = () => {
  const {isInitializing, isLoggedIn} = useAuthenticationStatus();

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleNotification(remoteMessage);
        }
      });
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.initContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isLoggedIn ? <OnboardingNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
};

const TENANT: ITenantContext = {tenant: 'medsense'};

export default function App() {
  return (
    <TenantContext.Provider value={TENANT}>
      <AuthenticationProvider>
        <HubSettingsProvider>
          <WifiSettingsProvider>
            <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
              <RootNavigator />
            </ThemeProvider>
          </WifiSettingsProvider>
        </HubSettingsProvider>
      </AuthenticationProvider>
    </TenantContext.Provider>
  );
}

const styles = StyleSheet.create({
  initContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
