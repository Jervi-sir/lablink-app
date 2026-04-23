import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'open',
  size?: number | 24,
  color?: string
}

const PlusIcon: React.FC<type> = ({ type = 'open', color = '#111', size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path fill={color} d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
  </Svg>
);
export default PlusIcon;