import {useTheme} from '@app/contexts/theme';
import {Layout, margin} from '@app/appearance/layout';
import {MedsenseButton} from '@app/components/Button';
import {Card} from '@app/components/Card';
import {MedsenseIcon} from '@app/components/Icon';
import {MedsenseText} from '@app/components/Text';
import * as React from 'react';
import {StyleSheet, Pressable, View} from 'react-native';

type MedicationFormCardProps = React.PropsWithChildren<{
  heading: string;
  subheading: string;
  onPressNext: () => void;
  onPressBack: () => void;
  disableNextButton?: boolean;
  onPressSkipForNow?: () => void;
  belowButtonsContent?: React.ReactNode | undefined;
}>;

const copy = {
  next: 'Next',
  back: 'Back',
  skipForNow: 'Skip for now',
};

export const MedicationFormCard: React.FC<MedicationFormCardProps> = ({
  heading,
  children,
  subheading,
  onPressBack,
  onPressNext,
  disableNextButton,
  onPressSkipForNow,
  belowButtonsContent,
}) => {
  const theme = useTheme();
  return (
    <Card style={margin('top', 'p3')}>
      <View style={margin('bottom', 'p2')}>
        <MedsenseText size="h1" style={Layout.standardHeadingBottomMargin}>
          {heading}
        </MedsenseText>
        <MedsenseText muted={true} style={Layout.standardHeadingBottomMargin}>
          {subheading}
        </MedsenseText>
      </View>
      {children}
      <MedsenseButton
        disabled={disableNextButton}
        onPress={onPressNext}
        style={margin('bottom', 'p2')}>
        {copy.next}
      </MedsenseButton>
      <MedsenseButton onPress={onPressBack} outline={true}>
        {copy.back}
      </MedsenseButton>
      {onPressSkipForNow && (
        <Pressable
          style={[styles.skipBtn, margin('top', 'p5')]}
          onPress={onPressSkipForNow}>
          <MedsenseText style={margin('right', 'p2')}>
            {copy.skipForNow}
          </MedsenseText>
          <MedsenseIcon
            icon="right-chevron"
            color={theme.accentColor}
            size={{height: 16}}
          />
        </Pressable>
      )}
      {belowButtonsContent}
    </Card>
  );
};

const styles = StyleSheet.create({
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
