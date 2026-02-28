import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const ShareIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="m2.6 10.42 7.64 3.34 3.34 7.64c.16.37.52.6.92.6h.05a1 1 0 0 0 .9-.69l5.5-17a.988.988 0 0 0-1.25-1.25L2.69 8.55c-.4.13-.67.49-.69.9s.22.8.6.97"
    />
  </Svg>
);
export default ShareIcon;