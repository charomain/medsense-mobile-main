import * as React from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {Pill} from './Pill';
import {CarePortal} from './CarePortal';
import {LeftChevron} from './LeftChevron';
import {RightChevron} from './RightChevron';
import {Graph} from './Graph';
import {CareGivers} from './CareGivers';
import {Notifications} from './Notifications';
import {Gear} from './Gear';
import {More} from './More';
import {Plus} from './Plus';
import {Profile} from './Profile';
import {LogoDark} from './LogoDark';
import {X} from './X';
import {EyeOff} from './EyeOff';
import {EyeOn} from './EyeOn';
import {ArrowUp} from './ArrowUp';
import {ArrowDown} from './ArrowDown';
import {Toothcase} from './Toothcase';
import {
  OneDimension,
  dimensionsForAspectRatio,
  SvgIconComponent,
} from './types';

const editIcon = require('./assets/edit.png');
const searchIcon = require('./assets/search.png');

type ImageIcon = 'edit' | 'search';
type SvgIcon =
  | 'pill'
  | 'care-portal'
  | 'right-chevron'
  | 'left-chevron'
  | 'graph'
  | 'care-givers'
  | 'notifications'
  | 'gear'
  | 'plus'
  | 'profile'
  | 'logo-dark'
  | 'toothcase'
  | 'x'
  | 'eye-off'
  | 'eye-on'
  | 'arrow-up'
  | 'arrow-down'
  | 'more';

const isImageIcon = (icon: Icon): icon is ImageIcon => {
  return icon === 'edit' || icon === 'search';
};

const COMPONENT_MAP: Record<SvgIcon, SvgIconComponent> = {
  'care-portal': CarePortal,
  pill: Pill,
  'right-chevron': RightChevron,
  'left-chevron': LeftChevron,
  graph: Graph,
  'care-givers': CareGivers,
  notifications: Notifications,
  gear: Gear,
  more: More,
  plus: Plus,
  profile: Profile,
  'logo-dark': LogoDark,
  toothcase: Toothcase,
  x: X,
  'eye-off': EyeOff,
  'eye-on': EyeOn,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
};

type ImageIconProps = {
  color: string;
  icon: ImageIcon;
  style?: StyleProp<ImageStyle>;
  size: OneDimension;
};

const ImageIcon: React.FC<ImageIconProps> = ({style, icon, color, size}) => {
  const source = React.useMemo(() => {
    switch (icon) {
      case 'edit':
        return editIcon;
      case 'search':
        return searchIcon;
    }
  }, [icon]);

  return (
    <Image
      resizeMode="contain"
      style={[{tintColor: color}, style, dimensionsForAspectRatio(size, 1)]}
      source={source}
    />
  );
};

export type Icon = ImageIcon | SvgIcon;

type MedsenseIconProps = {
  color: string;
  icon: Icon;
  style?: StyleProp<ImageStyle>;
  size: OneDimension;
};

export const MedsenseIcon: React.FC<MedsenseIconProps> = ({
  style,
  icon,
  color,
  size,
}) => {
  if (isImageIcon(icon)) {
    return <ImageIcon size={size} style={style} color={color} icon={icon} />;
  }

  const Component = COMPONENT_MAP[icon];
  return <Component size={size} color={color} style={style} />;
};

// const styles = StyleSheet.create({});
