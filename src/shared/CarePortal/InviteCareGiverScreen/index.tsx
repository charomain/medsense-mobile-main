import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Layout} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {InviteCareGiverForm} from './Form';
import {CarePortalAPI} from '../types';

type InviteCareGiverScreenProps = CarePortalAPI & {
  goBack(): void;
};

export const InviteCareGiverScreen: React.FC<InviteCareGiverScreenProps> = ({
  goBack,
  loading,
  shareProfileWith,
}) => {
  const onSubmit = React.useCallback(
    (email: string) => {
      shareProfileWith(email);
      goBack();
    },
    [shareProfileWith, goBack],
  );

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <InviteCareGiverForm onCancel={goBack} onSubmit={onSubmit} />
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Layout.standardSpacing.p1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
