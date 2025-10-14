import {StyleProp, ViewStyle} from 'react-native';

const GRID_UNIT = 8;

export const Layout = {
  standardSpacing: {
    p05: GRID_UNIT * 0.5,
    p1: GRID_UNIT * 1,
    p2: GRID_UNIT * 2,
    p3: GRID_UNIT * 3,
    p4: GRID_UNIT * 4,
    p5: GRID_UNIT * 5,
    p10: GRID_UNIT * 10,
  },
  buttonBorderRadius: 10,
  listGroupBorderRadius: 5,
  standardHeadingBottomMargin: {marginBottom: GRID_UNIT * 2},
};

type BoxSpacingLocation =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'vertical'
  | 'horizontal'
  | 'all';

export const padding = (
  loc: BoxSpacingLocation,
  size: keyof typeof Layout.standardSpacing,
): NonNullable<StyleProp<ViewStyle>> => {
  const px = Layout.standardSpacing[size];
  switch (loc) {
    case 'top':
      return {paddingTop: px};
    case 'left':
      return {paddingLeft: px};
    case 'right':
      return {paddingRight: px};
    case 'bottom':
      return {paddingBottom: px};
    case 'horizontal':
      return {paddingHorizontal: px};
    case 'vertical':
      return {paddingVertical: px};
    case 'all':
      return {padding: px};
  }
};

export const margin = (
  loc: BoxSpacingLocation,
  size: keyof typeof Layout.standardSpacing,
): NonNullable<StyleProp<ViewStyle>> => {
  const px = Layout.standardSpacing[size];
  switch (loc) {
    case 'top':
      return {marginTop: px};
    case 'left':
      return {marginLeft: px};
    case 'right':
      return {marginRight: px};
    case 'bottom':
      return {marginBottom: px};
    case 'horizontal':
      return {marginHorizontal: px};
    case 'vertical':
      return {marginVertical: px};
    case 'all':
      return {margin: px};
  }
};

export const standardFormElementSpacing = (): NonNullable<
  StyleProp<ViewStyle>
> => {
  return margin('bottom', 'p3');
};
