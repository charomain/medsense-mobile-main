import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const EyeOn: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg
      viewBox="0 0 24 30"
      x="0px"
      y="0px"
      width={width}
      height={height}
      {...props}>
      <G>
        <Path
          fill={props.color}
          d="M12,9a3,3,0,1,0,3,3A3,3,0,0,0,12,9Zm0,4a1,1,0,1,1,1-1A1,1,0,0,1,12,13Z"
        />
        <Path
          fill={props.color}
          d="M21.78,11.37C21.6,11.15,17.39,6,12,6s-9.6,5.15-9.78,5.37a1,1,0,0,0,0,1.26C2.4,12.85,6.61,18,12,18s9.6-5.15,9.78-5.37A1,1,0,0,0,21.78,11.37ZM12,16c-3.42,0-6.44-2.73-7.65-4C5.56,10.73,8.58,8,12,8s6.44,2.73,7.65,4C18.44,13.27,15.42,16,12,16Z"
        />
      </G>
    </Svg>
  );
};
