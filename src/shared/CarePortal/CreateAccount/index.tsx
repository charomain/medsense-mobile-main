import * as React from 'react';
import {StyleSheet} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CreateAccountForm} from './CreateAccountForm';
import {useCreateChildAccountAPI} from './hooks';

type CreateAccountProps = {
  goBack(): void;
};

export const CreateAccount: React.FC<CreateAccountProps> = ({goBack}) => {
  const {loading, request} = useCreateChildAccountAPI(() => {
    goBack();
  });

  const onSubmit = React.useCallback(
    (email: string) => {
      request({
        email,
      });
    },
    [request],
  );

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <CreateAccountForm onPressCancel={goBack} onSubmit={onSubmit} />
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
