import * as React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Layout} from '@app/appearance/layout';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseButton} from '@app/components/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EditProfileForm} from './EditProfileForm';
import {margin} from '@app/appearance/layout';
import {UserProfile} from '@app/models/profile';
import {useSaveProfile} from './hooks';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import {NavigationProp} from '@react-navigation/native';

type EditProfileScreenProps = {
  currentProfile: UserProfile;
  navigation: NavigationProp<any>;
  onSaveProfile(profile: UserProfile): void;
  onPressChangePassword: (() => void) | null;
};

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
  onSaveProfile,
  onPressChangePassword,
  currentProfile,
}) => {
  const {loading, updateProfile, uploading, updateProfilePhoto, deleteAccount} =
    useSaveProfile(onSaveProfile);

  const onPressDelete = React.useCallback(() => {
    // deleteAccount({});
    Alert.alert('Are you sure you want to delete your account?', '', [
      {
        text: 'Yes, delete my account',
        style: 'destructive',
        onPress: () => {
          deleteAccount({});
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  }, [deleteAccount]);

  return (
    <MedsenseScreen
      showLoadingOverlay={loading || uploading}
      includeSpacing={false}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        enableOnAndroid={true}
        viewIsInsideTabBar={true}
        contentContainerStyle={styles.content}>
        <ScreenTextHeading
          onPressBack={() => navigation.goBack()}
          title={'Edit Profile'}
          subtitle={null}
        />
        <EditProfileForm
          onPressChangePassword={onPressChangePassword}
          onSubmit={updateProfile}
          updateProfilePhoto={updateProfilePhoto}
          currentProfile={currentProfile}
        />
        <MedsenseButton
          flavor="danger"
          style={margin('top', 'p4')}
          onPress={onPressDelete}>
          Delete Account
        </MedsenseButton>
      </KeyboardAwareScrollView>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Layout.standardSpacing.p3,
    paddingHorizontal: Layout.standardSpacing.p2,
    paddingBottom: Layout.standardSpacing.p3,
  },
});
