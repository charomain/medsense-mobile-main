import * as React from 'react';
import Svg, {Defs, Path, G, Use} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const X: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg
      preserveAspectRatio="none"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      {...props}>
      <Defs>
        <G id="a">
          <Path
            fill={props.color}
            stroke="none"
            d=" M 82.1 22.1 Q 83.0017578125 21.24453125 83 20 83.0017578125 18.75546875 82.1 17.85 81.24453125 16.9982421875 80 17 78.7552734375 16.998046875 77.85 17.85 L 50 45.75 22.1 17.85 Q 21.24453125 16.998046875 20 17 18.75546875 16.9982421875 17.85 17.85 16.9982421875 18.75546875 17 20 16.998046875 21.24453125 17.85 22.1 L 45.75 50 17.85 77.85 Q 16.998046875 78.7552734375 17 80 16.9982421875 81.24453125 17.85 82.1 18.75546875 83.0017578125 20 83 21.24453125 83.0017578125 22.1 82.1 L 50 54.25 77.85 82.1 Q 78.7552734375 83.0017578125 80 83 81.24453125 83.0017578125 82.1 82.1 83.0017578125 81.24453125 83 80 83.0017578125 78.7552734375 82.1 77.85 L 54.25 50 82.1 22.1 Z"
          />
        </G>
      </Defs>
      <G transform="matrix( 1, 0, 0, 1, 0,0) ">
        <Use xlinkHref="#a" />
      </G>
    </Svg>
  );
};
