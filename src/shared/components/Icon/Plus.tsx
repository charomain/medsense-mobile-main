import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const Plus: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg width={width} height={height} viewBox="0 0 13 13" fill="none">
      <Path
        d="M12.7881 7.58405H7.58454V12.7876H5.85002V7.58405H0.646484V5.84954H5.85002V0.645996H7.58454V5.84954H12.7881V7.58405Z"
        fill={props.color}
      />
    </Svg>
  );
};
