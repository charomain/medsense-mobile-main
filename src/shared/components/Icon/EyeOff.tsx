import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const EyeOff: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg
      viewBox="0 0 24 30"
      x="0px"
      y="0px"
      width={width}
      height={height}
      {...props}>
      <G data-name="eye off">
        <Path
          fill={props.color}
          d="M21.78,11.37C21.6,11.15,17.39,6,12,6a9.35,9.35,0,0,0-3,.52l-1.15-2a1,1,0,1,0-1.74,1L9.5,11.39v0l4.62,8.08a1,1,0,1,0,1.74-1l-.64-1.11a16.85,16.85,0,0,0,6.55-4.76A1,1,0,0,0,21.78,11.37ZM12.6,12.78l-1-1.7A1,1,0,0,1,12,11a1,1,0,0,1,1,1A1,1,0,0,1,12.6,12.78Zm1.62,2.84-.63-1.1A3,3,0,0,0,15,12a3,3,0,0,0-3-3,3,3,0,0,0-1.37.34L10,8.3A7.12,7.12,0,0,1,12,8c3.42,0,6.44,2.74,7.65,4A14.12,14.12,0,0,1,14.22,15.62Z"
        />
        <Path
          fill={props.color}
          d="M10.75,15.88C7.86,15.35,5.41,13.11,4.34,12a17.64,17.64,0,0,1,2.4-2.07A1,1,0,0,0,7,8.54a1,1,0,0,0-1.4-.24,18.49,18.49,0,0,0-3.36,3.07,1,1,0,0,0,0,1.26c.14.18,3.57,4.37,8.17,5.22l.18,0a1,1,0,0,0,.18-2Z"
        />
      </G>
    </Svg>
  );
};
