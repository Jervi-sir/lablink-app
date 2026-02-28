import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'open',
  size?: number | 24,
  color?: string
}

const Messageicon: React.FC<type> = ({ type = 'open', color = '#111', size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4.724l-4.762 2.857a1 1 0 0 1-1.508-.743L7 21v-2H6a4 4 0 0 1-3.995-3.8L2 15V7a4 4 0 0 1 4-4zm-4 9H8a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m2-4H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2"
    />
  </Svg>
);
export default Messageicon;