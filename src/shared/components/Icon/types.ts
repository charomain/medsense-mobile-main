import {FC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

export type WidthDimension = {width: number};
export type OneDimension = WidthDimension | {height: number};

export type SvgIconComponent = FC<{
  color: string;
  size: OneDimension;
  style: StyleProp<ViewStyle>;
}>;

const isWidthDimension = (
  oneDimension: OneDimension,
): oneDimension is WidthDimension => {
  return (oneDimension as WidthDimension).width !== undefined;
};

export const dimensionsForAspectRatio = (
  oneDimension: OneDimension,
  aspectRatio: number,
) => {
  if (isWidthDimension(oneDimension)) {
    return {
      width: oneDimension.width,
      height: oneDimension.width / aspectRatio,
    };
  } else {
    return {
      width: oneDimension.height * aspectRatio,
      height: oneDimension.height,
    };
  }
};
