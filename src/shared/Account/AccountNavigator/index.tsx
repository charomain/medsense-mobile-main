import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EditProfileScreen} from './EditProfileScreen';
import {ChangePasswordScreen} from './ChangePasswordScreen';
import {AccountStackParamList} from './types';
import {useAuthStore} from '@app/stores/auth';

const AccountStack = createNativeStackNavigator<AccountStackParamList>();

export const AccountNavigator = () => {
  const {setProfile, profile} = useAuthStore();

  return (
    <AccountStack.Navigator screenOptions={{headerShown: false}}>
      <AccountStack.Screen name="EditProfile">
        {props => (
          <EditProfileScreen
            currentProfile={profile!}
            onPressChangePassword={() =>
              props.navigation.push('ChangePassword')
            }
            {...props}
            onSaveProfile={setProfile}
          />
        )}
      </AccountStack.Screen>
      <AccountStack.Screen
        name="ChangePassword"
        options={{
          title: 'Change Password',
        }}
        component={ChangePasswordScreen}
      />
    </AccountStack.Navigator>
  );
};
