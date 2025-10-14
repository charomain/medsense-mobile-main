import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {SvgIconComponent, dimensionsForAspectRatio} from './types';

export const Graph: SvgIconComponent = props => {
  const {width, height} = dimensionsForAspectRatio(props.size, 1);
  return (
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none">
      <Path
        d="M20.75 21.5H0.75C0.34 21.5 0 21.16 0 20.75C0 20.34 0.34 20 0.75 20H20.75C21.16 20 21.5 20.34 21.5 20.75C21.5 21.16 21.16 21.5 20.75 21.5Z"
        fill={props.color}
      />
      <Path
        d="M13 21.5H8.5C8.09 21.5 7.75 21.16 7.75 20.75V2.75C7.75 1.03 8.7 0 10.3 0H11.2C12.8 0 13.75 1.03 13.75 2.75V20.75C13.75 21.16 13.41 21.5 13 21.5ZM9.25 20H12.25V2.75C12.25 1.6 11.71 1.5 11.2 1.5H10.3C9.79 1.5 9.25 1.6 9.25 2.75V20Z"
        fill={props.color}
      />
      <Path
        d="M5.75 21.5H1.75C1.34 21.5 1 21.16 1 20.75V8.75C1 7.03 1.88 6 3.35 6H4.15C5.62 6 6.5 7.03 6.5 8.75V20.75C6.5 21.16 6.16 21.5 5.75 21.5ZM2.5 20H5V8.75C5 7.5 4.45 7.5 4.15 7.5H3.35C3.05 7.5 2.5 7.5 2.5 8.75V20Z"
        fill={props.color}
      />
      <Path
        d="M19.75 21.5H15.75C15.34 21.5 15 21.16 15 20.75V13.75C15 12.03 15.88 11 17.35 11H18.15C19.62 11 20.5 12.03 20.5 13.75V20.75C20.5 21.16 20.16 21.5 19.75 21.5ZM16.5 20H19V13.75C19 12.5 18.45 12.5 18.15 12.5H17.35C17.05 12.5 16.5 12.5 16.5 13.75V20Z"
        fill={props.color}
      />
    </Svg>
  );
};
