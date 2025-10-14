import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Card} from '@app/components/Card';
import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import type {StyleProp, ViewStyle} from 'react-native';
import {MedsenseIcon} from '@app/components/Icon';
import {Badge} from '@app/components/Badge';
import {UserProgramEnrollment} from '@app/models/program';

type ProgramRowProps = {
  item: UserProgramEnrollment;
  style: StyleProp<ViewStyle>;
  onPress(item: UserProgramEnrollment): void;
};

const copy = {
  patient: 'Patient',
  viewDetails: 'Program Details',
};

export const ProgramRow: React.FC<ProgramRowProps> = ({
  item,
  onPress,
  style,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const onPressDetails = React.useCallback(() => {
    setExpanded(!expanded);
  }, [setExpanded, expanded]);

  const theme = useTheme();
  const onPressCard = React.useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  return (
    <Card onPress={onPressCard} style={style} flavor="contrast">
      <View style={styles.row}>
        <View style={styles.text}>
          <MedsenseText flavor="contrast">{item.careProgram.name}</MedsenseText>
        </View>
      </View>
      <View style={[margin('top', 'p3'), styles.contentRow]}>
        <Pressable onPress={onPressDetails} style={styles.detailsContainer}>
          <MedsenseIcon
            icon="eye-on"
            size={{height: 18}}
            color={theme.screens.contrast.textColor}
          />
          <MedsenseText
            style={[
              {color: theme.screens.contrast.textColor},
              margin('left', 'p05'),
            ]}
            size="sm">
            {copy.viewDetails}
          </MedsenseText>
        </Pressable>
        <View style={styles.actionButtonContainer}>
          <Badge flavor="accent" text="+10%" />
        </View>
      </View>
      {expanded && (
        <View>
          <MedsenseText flavor="contrast" style={margin('top', 'p3')} />
        </View>
      )}
    </Card>
  );
};

const SIZE = 50;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  initials: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.standardSpacing.p2,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  detailsText: {},

  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  actionButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
