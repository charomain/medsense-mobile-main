import {Layout} from '@app/appearance/layout';
import * as React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {MedsenseText} from '@app/shared/components/Text';
import {MedsenseIcon} from '@app/shared/components/Icon';

type EditButtonProps = {
  onPressEdit(): void;
  textColor: string;
};

const copy = {
  edit: 'Edit',
};

export const EditButton: React.FC<EditButtonProps> = ({
  onPressEdit,
  textColor,
}) => {
  return (
    <Pressable onPress={onPressEdit} style={styles.editContainer}>
      <MedsenseIcon
        icon="edit"
        color={textColor}
        style={styles.editIcon}
        size={{height: 16}}
      />
      <MedsenseText
        style={{
          color: textColor,
        }}
        size="sm">
        {copy.edit}
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
  editIcon: {
    marginRight: Layout.standardSpacing.p1,
  },
});
