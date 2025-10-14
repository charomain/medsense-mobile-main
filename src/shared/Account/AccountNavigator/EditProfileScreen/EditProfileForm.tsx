import * as React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {margin, standardFormElementSpacing} from '@app/appearance/layout';
import {
  UpdateUserProfileRequest,
  UploadPhotoProfileRequest,
} from '@app/services/api/profile';
import {MedsenseButton} from '@app/components/Button';
import {MedsenseTextInput} from '@app/components/TextInput';
import {Card} from '@app/components/Card';
import {useCallback, useState} from 'react';
import {ChangePasswordButton} from './ChangePasswordButton';
import {MedsenseDateInput} from '@app/components/DateInput';
import {View, Image, StyleSheet} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {UserProfile, isValidEmail, isValidPhone} from '@app/models/profile';
import {fixFilePath, getFullUploadUrl} from '@app/models/common';

const copy = {
  heading: 'Edit Your Account Information',

  cta: 'Save changes',
  signOut: 'Sign Out',

  errors: {
    missingFirstName: 'Please enter your first name',
    missingLastName: 'Please enter your last name',
    missingEmail: 'Please enter your email',
    missingBirthday: 'Please enter your birthday',
    missingPhone: 'Please enter your phone',
  },

  deleteAccount: 'Delete Account',
};

type EditProfileFormProps = {
  currentProfile: UserProfile;
  onPressChangePassword: (() => void) | null;
  onSubmit(data: UpdateUserProfileRequest): void;
  updateProfilePhoto(data: UploadPhotoProfileRequest): void;
};

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onPressChangePassword,
  onSubmit,
  updateProfilePhoto,
  currentProfile,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [firstName, setFirstName] = useState(currentProfile.firstName);
  const [lastName, setLastName] = useState(currentProfile.lastName);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    currentProfile.birthday,
  );
  const [phoneNumber, setPhoneNumber] = useState(
    currentProfile.phoneNumber ?? '',
  );

  const [email, setEmail] = useState(currentProfile.email);

  const onPressCTA = useCallback(() => {
    if (
      !isValidEmail(email) ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !isValidPhone(phoneNumber)
    ) {
      return setHasSubmitted(true);
    }

    onSubmit({
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
    });
  }, [email, onSubmit, firstName, lastName, dateOfBirth, phoneNumber]);

  const onBlurPhone = React.useCallback(() => {
    if (!phoneNumber.startsWith('+1')) {
      setPhoneNumber(
        phoneNumber.startsWith('1') ? `+${phoneNumber}` : `+1${phoneNumber}`,
      );
    }
  }, [phoneNumber, setPhoneNumber]);

  const pickImage = async () => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });

    updateProfilePhoto({
      photo: fixFilePath(image.path),
      size: image.size,
    });
  };

  return (
    <Card style={margin('bottom', 'p3')}>
      <View>
        <MedsenseText size="h1">{copy.heading}</MedsenseText>
      </View>
      {currentProfile.photo && (
        <Image
          style={styles.profilePhoto}
          source={{uri: getFullUploadUrl(currentProfile.photo)}}
        />
      )}
      <View style={margin('bottom', 'p4')}>
        <MedsenseButton onPress={pickImage}>Upload photo</MedsenseButton>
      </View>
      <MedsenseTextInput
        label="First Name"
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
        textContentType="givenName"
        style={standardFormElementSpacing()}
        errorText={
          hasSubmitted && !firstName ? copy.errors.missingFirstName : undefined
        }
      />
      <MedsenseTextInput
        label="Last Name"
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
        textContentType="familyName"
        style={standardFormElementSpacing()}
        errorText={
          hasSubmitted && !lastName ? copy.errors.missingLastName : undefined
        }
      />
      <MedsenseTextInput
        label="Email"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        style={standardFormElementSpacing()}
        autoCapitalize="none"
        errorText={
          hasSubmitted && !isValidEmail(email)
            ? copy.errors.missingEmail
            : undefined
        }
      />
      <MedsenseDateInput
        label="Birthday"
        emptyText={'Select your birthdate'}
        value={dateOfBirth}
        onChange={setDateOfBirth}
        dateFormat="MM/dd/uuuu"
        datePickerMode="date"
        defaultValue={new Date()}
        errorText={
          hasSubmitted && !dateOfBirth ? copy.errors.missingBirthday : undefined
        }
      />
      <MedsenseTextInput
        label="Phone"
        placeholder="+1"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        textContentType="telephoneNumber"
        style={standardFormElementSpacing()}
        onBlur={onBlurPhone}
        autoCapitalize="none"
        keyboardType="phone-pad"
        errorText={
          hasSubmitted && !isValidPhone(phoneNumber)
            ? copy.errors.missingPhone
            : undefined
        }
      />
      {onPressChangePassword && (
        <ChangePasswordButton onPress={onPressChangePassword} />
      )}
      <MedsenseButton onPress={onPressCTA}>{copy.cta}</MedsenseButton>
    </Card>
  );
};

const PROFILE_SIZE = 74;

const styles = StyleSheet.create({
  profilePhoto: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
    borderRadius: PROFILE_SIZE / 2,
  },
});
