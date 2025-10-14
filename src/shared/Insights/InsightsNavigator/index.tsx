import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {InsightsMainScreen} from './InsightsMainScreen';
import {InsightsDetailScreen} from './InsightsDetailScreen';
import {InsightsStackParamList} from './types';
import {PRNInsightDetailScreen} from './PRNInsightDetailScreen';
import {ProgramDetailScreen} from './ProgramDetailScreen';

const InsightStack = createNativeStackNavigator<InsightsStackParamList>();

export const InsightsNavigator = () => {
  return (
    <InsightStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <InsightStack.Screen name="InsightsMain" component={InsightsMainScreen} />
      <InsightStack.Screen
        name="InsightsDetail"
        component={InsightsDetailScreen}
      />
      <InsightStack.Screen
        name="PRNInsightDetailScreen"
        component={PRNInsightDetailScreen}
      />
      <InsightStack.Screen
        name="ProgramDetailScreen"
        component={ProgramDetailScreen}
      />
    </InsightStack.Navigator>
  );
};
