import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const SavedProductIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="M5 21q-.824 0-1.412-.587A1.93 1.93 0 0 1 3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188.413.187.687.537l1.25 1.525q.225.274.338.6t.112.675V19q0 .825-.587 1.413A1.92 1.92 0 0 1 19 21zm.4-15h13.2l-.85-1H6.25zM16 8H8v6.375q0 .575.475.863a.95.95 0 0 0 .975.037L12 14l2.55 1.275a.95.95 0 0 0 .975-.038q.475-.289.475-.862z"
    />
  </Svg>
);
export default SavedProductIcon;