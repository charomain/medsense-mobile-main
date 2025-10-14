import * as React from 'react';
import {MedsenseScreen} from '@app/components/Screen';
import {
  GestureResponderEvent,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import {MedsenseText} from '@app/components/Text';
import {margin, padding} from '@app/appearance/layout';
import {useAddBeaconAPI} from '@app/shared/Beacons/hooks';
import {MedsenseButton} from '@app/components/Button';
import {FullWidthContainer} from '@app/components/FullWidthContainer';
import {useCameraDevice, useCodeScanner, Camera} from 'react-native-vision-camera';
import {check, openSettings, request as requestPermission, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {runOnJS} from 'react-native-reanimated';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

type AddMedicationQRProps = {
  onSuccessfulScan(): void;
  onPressManualEntry(): void;
};

const copy = {
  header: 'Scan a QR code',
  subheader:
    'Please scan the QR code on the back of a sensor or a pill organizer.',
  manualButton: 'Enter Sensor Manually',
};

export const AddMedicationQR: React.FC<AddMedicationQRProps> = ({
  onSuccessfulScan,
  onPressManualEntry,
}) => {
  const camera = React.useRef<Camera>(null);
  const {request, loading} = useAddBeaconAPI(() => {
    onSuccessfulScan();
  });
  const submitQRCode = React.useCallback(
    (rawData: string | undefined) => {
      if (rawData) {
        request({
          qrcode: rawData,
        });
      }
    },
    [request],
  );

  const submittedQrCodes = React.useRef(new Set<string>());
  const [hasPermission, setHasPermission] = React.useState(false);

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      codes.forEach(code => {
        const rawData = code.value;
        if (rawData && !submittedQrCodes.current.has(rawData)) {
          runOnJS(submitQRCode)(rawData);
          submittedQrCodes.current.add(rawData);
        }
      });
    },
  });

  React.useEffect(() => {
    checkPermission();
  }, []);

  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('cannot open settings'));
  };

  const checkPermission = async () => {
    // Checks Camera permission
    try {
      const isGranted = await checkCameraPermission();

      if (!isGranted) {
        setTimeout(() => {
          handleOpenSettings();
        }, 500);
      } else {
        setHasPermission(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkCameraPermission = async () => {
    let result = RESULTS.UNAVAILABLE;

    try {
      result = await check(cameraPermission);
  
      if (result === RESULTS.DENIED) {
        result = await requestPermission(cameraPermission);
      }
    } catch (error) {
      console.log(error);
    }
  
    return result === RESULTS.GRANTED;
  };

  const onPressEnterManually = React.useCallback(() => {
    onPressManualEntry();
  }, [onPressManualEntry]);

  const onPressCameraView = React.useCallback(
    async (event: GestureResponderEvent) => {
      const px = PixelRatio.get();
      await camera.current?.focus({
        x: event.nativeEvent.locationX * px,
        y: event.nativeEvent.locationY * px,
      });
    },
    [],
  );

  console.log(device, hasPermission)
  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={false}>
      <View
        style={[
          margin('top', 'p2'),
          padding('horizontal', 'p5'),
          padding('bottom', 'p3'),
        ]}>
        <MedsenseText style={margin('top', 'p2')} align="center" size="h1">
          {copy.header}
        </MedsenseText>
        <MedsenseText style={margin('top', 'p2')} muted={true} align="center">
          {copy.subheader}
        </MedsenseText>
      </View>
      <View style={styles.cameraWrapper}>
        {device && hasPermission && (
          <TouchableOpacity
            activeOpacity={0.99}
            style={StyleSheet.absoluteFill}
            onPress={onPressCameraView}>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              codeScanner={codeScanner}
              zoom={3}
            />
            <View style={styles.rect} />
          </TouchableOpacity>
        )}
      </View>
      <FullWidthContainer
        style={[padding('top', 'p3'), padding('horizontal', 'p3')]}>
        <MedsenseButton onPress={onPressEnterManually}>
          {copy.manualButton}
        </MedsenseButton>
      </FullWidthContainer>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraWrapper: {
    flex: 1,
  },
  helperPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  rect: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'red',
  },
});