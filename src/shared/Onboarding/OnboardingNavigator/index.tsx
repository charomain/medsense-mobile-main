import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from './SplashScreen';
import {CreateAccountNavigator} from './CreateAccount';
import {ForgotPasswordScreen} from './ForgotPasswordScreen';
import {OnboardingStackParamList} from './types';

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <OnboardingStack.Screen name="Splash" component={SplashScreen} />
      <OnboardingStack.Screen
        name="Register"
        component={CreateAccountNavigator}
      />
      <OnboardingStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </OnboardingStack.Navigator>
  );
};
