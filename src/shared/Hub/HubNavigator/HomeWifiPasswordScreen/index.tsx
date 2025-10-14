import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {ScreenTextHeading} from '@app/components/ScreenTextHeading';
import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {MedsenseScreen} from '@app/components/Screen';
import {ScreenLogoHeader} from '@app/components/ScreenLogoHeader';
import {HubStackScreenProps} from '../types';
import {MedsenseTextInput} from '@app/components/TextInput';
import {useWifiSettings} from '@app/stores/wifi';

type HomeWifiPasswordScreenProps = HubStackScreenProps<'HomeWifiPassword'>;

const copy = {
  title: 'Enter your home WiFi password',
  subtitle1: 'Reminder: You will not be able to use a 5G network.',

  next: 'Next',
};

export const HomeWifiPasswordScreen: React.FC<HomeWifiPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const savedWifiSettings = useWifiSettings();
  const [password, setPassword] = React.useState(
    savedWifiSettings.wifiSettings?.previousWifi.password ?? '',
  );
  const onPressNext = React.useCallback(() => {
    navigation.navigate('HubSetup', {
      homeWifiName: route.params.homeWifiName,
      homeWifiPassword: password,
    });
  }, [route, password, navigation]);

  return (
    <MedsenseScreen includeSpacing={true}>
      <ScreenLogoHeader />
      <ScreenTextHeading title="Hub Setup" subtitle="" />
      <ScrollView>
        <Card style={margin('top', 'p3')}>
          <View style={margin('bottom', 'p2')}>
            <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
              {copy.title}
            </MedsenseText>
            <MedsenseText
              muted={true}
              style={Layout.standardHeadingBottomMargin}>
              {copy.subtitle1}
            </MedsenseText>
          </View>
          <MedsenseTextInput
            label="Password"
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            textContentType="password"
            secureTextEntry={true}
            style={margin('bottom', 'p3')}
          />
          <MedsenseButton onPress={onPressNext} style={margin('bottom', 'p2')}>
            {copy.next}
          </MedsenseButton>
        </Card>
      </ScrollView>
    </MedsenseScreen>
  );
};
