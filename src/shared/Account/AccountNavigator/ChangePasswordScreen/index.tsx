import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Layout} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ChangePasswordForm} from './ChangePasswordForm';
import {useChangePasswordAPI} from './hooks';
import {AccountStackScreenProps} from '../types';

type ChangePasswordScreenProps = AccountStackScreenProps<'ChangePassword'>;

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
}) => {
  const {loading, request} = useChangePasswordAPI(() => {
    navigation.goBack();
  });

  const onSubmit = React.useCallback(
    (oldPassword: string, newPassword: string) => {
      request({
        oldPassword,
        newPassword,
      });
    },
    [request],
  );

  const onPressCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={false}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <ChangePasswordForm onPressCancel={onPressCancel} onSubmit={onSubmit} />
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.standardSpacing.p2,
  },
});
