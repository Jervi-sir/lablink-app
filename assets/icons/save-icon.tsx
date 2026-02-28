import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const SaveIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1-1.555.832L12 18.202l-5.444 3.63a1 1 0 0 1-1.55-.72L5 21V7a5 5 0 0 1 5-5z"
    />
  </Svg>
);
export default SaveIcon;