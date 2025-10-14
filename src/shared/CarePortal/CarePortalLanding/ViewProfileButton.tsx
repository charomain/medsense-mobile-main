import {useTheme} from '@app/contexts/theme';
import {Layout} from '@app/appearance/layout';
import {MedsenseIcon} from '@app/components/Icon';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {Pressable, StyleSheet} from 'react-native';

type ViewProfileButtonProps = {
  onPressView?(): void;
};

const copy = {
  viewProfile: 'View Profile',
};

export const ViewProfileButton: React.FC<ViewProfileButtonProps> = ({
  onPressView,
}) => {
  const theme = useTheme();
  const color = theme.screens.contrast.textColor;
  return (
    <Pressable onPress={onPressView} style={styles.editContainer}>
      <MedsenseIcon icon="profile" color={color} size={{height: 16}} />
      <MedsenseText style={[{color}, styles.text]} size="sm">
        {copy.viewProfile}
      </MedsenseText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    marginLeft: Layout.standardSpacing.p1,
  },
});
