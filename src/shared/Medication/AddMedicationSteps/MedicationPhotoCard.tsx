import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {margin} from '@app/appearance/layout';
import * as React from 'react';
import {MedicationFormCard} from '@app/shared/Medication/FormCard';
import {MedicationViewModel} from '../model';
import {StyleSheet, Linking, View, Platform} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {MedsenseButton} from '@app/components/Button';

type MedicationPhotoCardProps = {
  medication: MedicationViewModel;
  onPressNext(updatedMedication: MedicationViewModel): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Medication Photo',
  subheading: 'Please take a photo of the medication you are adding..',
  nameLabel: 'Medication name',
  namePlaceholder: 'Enter the medication name here...',
};

type CameraPermissionState = 'loading' | 'approved' | 'denied';

export const MedicationPhotoCard: React.FC<MedicationPhotoCardProps> = ({
  onPressBack,
  onPressNext,
  medication,
}) => {
  const camera = React.useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = React.useState(false);
  const device = useCameraDevice('back');
  const [permissionState, setPermissionState] =
    React.useState<CameraPermissionState>('loading');
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const onCameraInitialized = React.useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  React.useEffect(() => {
    const init = async () => {
      let cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === 'not-determined') {
        cameraPermission = await Camera.requestCameraPermission();
      }

      setPermissionState(cameraPermission === 'denied' ? 'denied' : 'approved');
    };

    init();
  }, []);

  const [disableNextButton, setDisableNextButton] = React.useState(false);

  const onPressNextWrapped = React.useCallback(async () => {
    if (!isCameraInitialized || !camera.current) {
      return;
    }

    setDisableNextButton(true);
    let photo;
    try {
      photo = await camera.current.takePhoto({
        flash: Platform.OS === 'android' ? 'off' : 'on',
      });
    } catch (err) {
      setCameraError((err as Error).message);
      return;
    }

    setDisableNextButton(false);
    if (photo) {
      onPressNext({
        ...medication,
        photo,
      });
    }
  }, [onPressNext, medication, isCameraInitialized]);

  const onPressSkip = React.useCallback(() => {
    onPressNext({
      ...medication,
    });
  }, [onPressNext, medication]);

  return (
    <MedicationFormCard
      heading={copy.heading}
      subheading={copy.subheading}
      disableNextButton={disableNextButton}
      onPressSkipForNow={onPressSkip}
      onPressNext={onPressNextWrapped}
      onPressBack={onPressBack}>
      {cameraError !== null && (
        <MedsenseText flavor="danger">{cameraError}</MedsenseText>
      )}
      <View style={[styles.cameraView, margin('bottom', 'p3')]}>
        {permissionState === 'approved' && device && (
          <Camera
            ref={camera}
            photo={true}
            isActive={true}
            device={device}
            style={StyleSheet.absoluteFill}
            onInitialized={onCameraInitialized}
          />
        )}
        {permissionState === 'denied' && (
          <View>
            <MedsenseText>
              Please enable camera permissions to take a photo.
            </MedsenseText>
            <MedsenseButton
              style={margin('top', 'p3')}
              onPress={() => Linking.openSettings()}>
              Open Settings
            </MedsenseButton>
          </View>
        )}
      </View>
    </MedicationFormCard>
  );
};

const styles = StyleSheet.create({
  cameraView: {
    flex: 1,
    height: 300,
  },
});