import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {CarePortalRowForParent} from './CareGiverRow';
import {AccessibleUserProfile} from '@app/models/profile';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {DashedBorderedButton} from '@app/components/DashedBorderedButton';
import {margin} from '@app/appearance/layout';
import {CarePortalAPI} from '../types';

type CareGiversScreenProps = CarePortalAPI & {
  onPressAdd(): void;
  onPressBack?(): void;
  title: string;
  subtitle: string;
};

export const CareGiversScreen: React.FC<CareGiversScreenProps> = ({
  onPressAdd,
  shareProfileWith,
  stopSharingWith,
  loading,
  careGivers,
  unconfirmedCareGivers,
  title,
  subtitle,
  onPressBack,
}) => {
  const resendRequest = React.useCallback(
    (item: AccessibleUserProfile) => {
      shareProfileWith(item.email);
    },
    [shareProfileWith],
  );

  return (
    <MedsenseScreen includeSpacing={true} showLoadingOverlay={loading}>
      <ScreenLogoHeader />
      <ScreenTextHeading
        onPressBack={onPressBack}
        title={title}
        subtitle={subtitle}
      />
      <View style={styles.content}>
        <FlatList
          data={[careGivers ?? [], unconfirmedCareGivers ?? []].reduce(
            (accum, row) => accum.concat(row),
            [],
          )}
          renderItem={({item}) => {
            return (
              <CarePortalRowForParent
                resendRequest={resendRequest}
                stopSharing={stopSharingWith}
                item={item}
              />
            );
          }}
          ListFooterComponent={
            <DashedBorderedButton
              style={margin('top', 'p3')}
              title="Add Caregiver"
              onPress={onPressAdd}
            />
          }
        />
      </View>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {},
});
