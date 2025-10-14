import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GettingStartedScreen} from './GettingStartedScreen';
import {EnterPhoneScreen} from './EnterPhoneScreen';
import {EnterNameScreen} from './EnterNameScreen';
import {RegisterScreen} from './RegisterScreen';
import {BirthdayScreen} from './BirthdayScreen';
import {FinishedScreen} from './FinishedScreen';

import {CreateAccountStackParamList} from './types';
import {OrganizationScreen} from './OrganizationScreen';

const CreateAccountStack =
  createNativeStackNavigator<CreateAccountStackParamList>();

export const CreateAccountNavigator = () => {
  return (
    <CreateAccountStack.Navigator
      initialRouteName="RegisterScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <CreateAccountStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <CreateAccountStack.Screen
        name="GettingStartedScreen"
        component={GettingStartedScreen}
      />
      <CreateAccountStack.Screen
        name="EnterPhoneScreen"
        component={EnterPhoneScreen}
      />
      <CreateAccountStack.Screen
        name="EnterNameScreen"
        component={EnterNameScreen}
      />
      <CreateAccountStack.Screen
        name="BirthdayScreen"
        component={BirthdayScreen}
      />
      <CreateAccountStack.Screen
        name="OrganizationScreen"
        component={OrganizationScreen}
      />
      <CreateAccountStack.Screen
        name="FinishedScreen"
        component={FinishedScreen}
      />
    </CreateAccountStack.Navigator>
  );
};
