import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const OrderIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="m3.72 2.787.55 1.863h14.654c1.84 0 3.245 1.717 2.715 3.51l-1.655 5.6c-.352 1.193-1.47 1.99-2.715 1.99H8.113c-1.244 0-2.362-.797-2.715-1.99L2.281 3.212a.75.75 0 1 1 1.439-.425M15.091 8.94a.75.75 0 0 0-1.216-.878l-1.713 2.371-.599-.684a.751.751 0 1 0-1.128.988l1.034 1.181a.974.974 0 0 0 1.522-.07zm-6.59 8.31a2.25 2.25 0 1 0-.001 4.5 2.25 2.25 0 0 0 0-4.5m8 0a2.25 2.25 0 1 0-.001 4.5 2.25 2.25 0 0 0 0-4.5"
    />
  </Svg>
);
export default OrderIcon;