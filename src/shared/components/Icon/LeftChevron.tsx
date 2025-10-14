import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const LeftChevron: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 8 / 12);
  return (
    <Svg width={width} height={height} viewBox="0 0 8 12" fill="none">
      <Path
        d="M7.41016 1.41L2.83016 6L7.41016 10.59L6.00016 12L0.00015614 6L6.00016 -6.16331e-08L7.41016 1.41Z"
        fill={props.color}
      />
    </Svg>
  );
};
