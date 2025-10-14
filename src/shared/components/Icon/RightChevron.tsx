import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const RightChevron: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 8 / 12);
  return (
    <Svg width={width} height={height} viewBox="0 0 8 12" fill="none">
      <Path
        d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 1.68141e-08L7.99984 6L1.99984 12L0.589844 10.59Z"
        fill={props.color}
      />
    </Svg>
  );
};
