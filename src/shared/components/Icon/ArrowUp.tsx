import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const ArrowUp: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg viewBox="0 0 268.831 268.832" width={width} height={height} {...props}>
      <Path
        fill={props.color}
        d="m223.255 83.659-80-79.998c-4.881-4.881-12.797-4.881-17.678 0l-80 80c-4.883 4.882-4.883 12.796 0 17.678 2.439 2.44 5.64 3.661 8.839 3.661s6.397-1.221 8.839-3.661l58.661-58.661v213.654c0 6.903 5.597 12.5 12.5 12.5 6.901 0 12.5-5.597 12.5-12.5V42.677l58.661 58.659c4.883 4.881 12.797 4.881 17.678 0 4.882-4.881 4.882-12.795 0-17.677z"
      />
    </Svg>
  );
};
