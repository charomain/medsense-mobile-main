import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CarePortalNavigator} from './CarePortal';
import {InsightsNavigator} from '@app/shared/Insights/InsightsNavigator';
import {MedicationNavigator} from './Medications';
import {MoreNavigator} from './More';
import {MainTabParamList} from './types';
import {useTheme} from '@app/contexts/theme';
import {MedsenseIcon} from '@app/components/Icon';
import {useHubStatusEffect, useSyncProfileAPI} from './hooks';

const MainTab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  const theme = useTheme();
  useSyncProfileAPI();
  useHubStatusEffect();

  return (
    <MainTab.Navigator
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarActiveTintColor: theme.accentColor,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingTop: 12,
          backgroundColor: theme.screens.primary.backgroundColor,
        },
      }}>
      <MainTab.Screen
        name="Medications"
        component={MedicationNavigator}
        options={{
          tabBarIcon: ({color, size}) => {
            return (
              <MedsenseIcon size={{height: size}} icon="pill" color={color} />
            );
          },
        }}
      />
      <MainTab.Screen
        name="Insights"
        component={InsightsNavigator}
        options={{
          tabBarIcon: ({color, size}) => {
            return (
              <MedsenseIcon size={{height: size}} icon="graph" color={color} />
            );
          },
        }}
      />
      <MainTab.Screen
        name="CarePortal"
        component={CarePortalNavigator}
        options={{
          tabBarIcon: ({color, size}) => {
            return (
              <MedsenseIcon
                size={{height: size}}
                icon="care-portal"
                color={color}
              />
            );
          },
        }}
      />
      <MainTab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({color, size}) => {
            return (
              <MedsenseIcon size={{height: size}} icon="more" color={color} />
            );
          },
        }}
      />
    </MainTab.Navigator>
  );
};
