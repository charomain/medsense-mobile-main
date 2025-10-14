import {margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseText} from '@app/components/Text';
import {useTheme} from '@app/contexts/theme';
import {useHubSettings} from '@app/stores/hub';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MedsenseIcon} from '../Icon';

type HubSetupActionProps = {
  onPressView(): void;
};

export const HubSetupAction: React.FC<HubSetupActionProps> = ({
  onPressView,
}) => {
  const theme = useTheme();
  const hubSettings = useHubSettings();
  const onPressClose = React.useCallback(() => {
    hubSettings.setHubSettings({
      hasSetup: false,
      ignoreHubSetupCTA: true,
    });
  }, [hubSettings]);

  if (
    hubSettings?.hubSettings?.hasSetup ||
    hubSettings?.hubSettings?.ignoreHubSetupCTA
  ) {
    return null;
  }

  return (
    <>
      <MedsenseText weight="bold" align="center">
        Pending Actions
      </MedsenseText>
      <Card style={margin('vertical', 'p3')} flavor="contrast">
        <View style={styles.content}>
          <View style={styles.textContent}>
            <MedsenseText style={margin('bottom', 'p1')} flavor="contrast">
              Set up your Hub
            </MedsenseText>
            <MedsenseText size="sm" flavor="muted">
              Connect your Hub
            </MedsenseText>
          </View>
          <View>
            <View style={[styles.xContainer, margin('bottom', 'p3')]}>
              <Pressable onPress={onPressClose}>
                <MedsenseIcon
                  color={theme.screens.contrast.textColor}
                  icon="x"
                  size={{height: 25}}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={margin('top', 'p1')}>
          <MedsenseButton onPress={onPressView}>Setup Hub</MedsenseButton>
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
  },
  textContent: {
    flex: 1,
  },
  xContainer: {
    alignItems: 'flex-end',
  },
});
