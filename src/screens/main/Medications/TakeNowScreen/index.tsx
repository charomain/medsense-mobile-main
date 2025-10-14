import {useTheme} from '@app/contexts/theme';
import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseIcon} from '@app/components/Icon';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {getFullUploadUrl} from '@app/models/common';
import {quantityNowLabel} from '@app/models/medication';
import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {MedicationListStackScreenProps} from '../types';
import {useTakeNowAPI} from './hooks';

type TakeNowScreenProps = MedicationListStackScreenProps<'TakeNow'>;

export const TakeNowScreen: React.FC<TakeNowScreenProps> = ({
  route,
  navigation,
}) => {
  const medication = route.params.medication;
  const theme = useTheme();
  const {loading, recordTaken} = useTakeNowAPI(() => {
    navigation.goBack();
  });

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <MedsenseText style={margin('top', 'p5')} size="h1" align="center">
        It's time to take a medication!
      </MedsenseText>
      <Card style={margin('top', 'p5')}>
        <MedsenseText size="h2" align="center">
          {medication.name}
        </MedsenseText>
        <View style={[margin('vertical', 'p3'), styles.medicationImageWrapper]}>
          {medication.image ? (
            <Image
              style={styles.medicationImage}
              source={{uri: getFullUploadUrl(medication.image)}}
            />
          ) : (
            <MedsenseIcon
              icon="pill"
              size={{height: 60}}
              color={theme.accentColor}
            />
          )}
        </View>
        <MedsenseText size="h1" align="center">
          {quantityNowLabel(medication)}
        </MedsenseText>
        <MedsenseButton
          style={margin('top', 'p3')}
          onPress={() => recordTaken(medication.id)}>
          Taken!
        </MedsenseButton>
      </Card>
    </MedsenseScreen>
  );
};

const MEDICATION_IMAGE_SIZE = 80;

const styles = StyleSheet.create({
  medicationImage: {
    width: MEDICATION_IMAGE_SIZE,
    height: MEDICATION_IMAGE_SIZE,
    borderRadius: MEDICATION_IMAGE_SIZE / 2,
  },
  medicationImageWrapper: {
    alignItems: 'center',
  },
});
