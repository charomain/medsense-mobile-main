import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MoreStackParamList} from './More/types';
import {CarePortalStackParamList} from './CarePortal/types';
import {MedicationListStackParamList} from './Medications/types';
import {InsightsStackParamList} from '@app/shared/Insights/InsightsNavigator/types';

export type MainTabParamList = {
  More: NavigatorScreenParams<MoreStackParamList>;
  Insights: NavigatorScreenParams<InsightsStackParamList>;
  CarePortal: NavigatorScreenParams<CarePortalStackParamList>;
  Medications: NavigatorScreenParams<MedicationListStackParamList>;
};

export type MainTabScreenProps<ScreenName extends keyof MainTabParamList> =
  NativeStackScreenProps<MainTabParamList, ScreenName>;

// export type MoreStackScreenProps = NativeStackScreenProps<MoreStackParamList>
// CompositeScreenProps<
//   BottomTabScreenProps<MainTabParamList, 'More'>,
//   NativeStackScreenProps<MoreStackParamList>
// >;
export type MoreStackScreenProps<ScreenName extends keyof MoreStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'More'>,
    NativeStackScreenProps<MoreStackParamList, ScreenName>
  >;
