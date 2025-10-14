import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseScreen} from '@app/components/Screen';
import {MedsenseText} from '@app/components/Text';
import {MedsenseTextInput} from '@app/components/TextInput';
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAddBeaconAPI} from '@app/shared/Beacons/hooks';

type AddMedicationManualEntryProps = {
  onFinishAdd(): void;
  onPressBack(): void;
};

const copy = {
  heading: 'Enter QR Code Manually',
  subheading:
    'Please enter the last six characters in the unique identification number on the back of your sensor or card.\n\nFor example, the red characters below you would enter for this identification number:',
  next: 'Next',
  back: 'Back',
};

export const AddMedicationManualEntry: React.FC<
  AddMedicationManualEntryProps
> = ({onFinishAdd, onPressBack}) => {
  const theme = useTheme();

  const {request, loading} = useAddBeaconAPI(() => {
    onFinishAdd();
  });

  const [uuid, setUUID] = React.useState('');
  const onPressNext = React.useCallback(() => {
    request({
      ident: uuid,
    });
  }, [uuid, request]);

  return (
    <MedsenseScreen showLoadingOverlay={loading} includeSpacing={true}>
      <Card style={margin('top', 'p3')}>
        <View style={margin('bottom', 'p2')}>
          <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
            {copy.heading}
          </MedsenseText>
          <MedsenseText muted={true} style={Layout.standardHeadingBottomMargin}>
            {copy.subheading}
          </MedsenseText>
          <Text
            style={[
              styles.exampleUuid,
              {color: theme.screens.primary.textColor},
            ]}>
            E2C56DB5-DFFB-48D2-0000-000000
            <Text style={{color: theme.dangerColor}}>000E8B</Text>
          </Text>
        </View>
        <MedsenseTextInput
          label="Unique Identification Number"
          placeholder="Enter last 6 digits"
          onChangeText={setUUID}
          value={uuid}
          style={margin('bottom', 'p5')}
        />
        <MedsenseButton onPress={onPressNext} style={margin('bottom', 'p2')}>
          {copy.next}
        </MedsenseButton>
        <MedsenseButton onPress={onPressBack} outline={true}>
          {copy.back}
        </MedsenseButton>
      </Card>
    </MedsenseScreen>
  );
};

const styles = StyleSheet.create({
  exampleUuid: {
    fontFamily: 'Courier',
  },
});
