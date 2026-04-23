import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const ArrowIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={stroke}
      d={
        type === 'left' ? "M4 12h16M10.455 19.2 4.002 12l6.453-7.2"
          : type === 'right' ? "M20 12H4M13.545 19.2l6.453-7.2-6.453-7.2"
            : type === 'down' ? "M11.998 20V4M19.198 13.545l-7.2 6.453-7.2-6.453"
              : type === 'up' ? "M12.002 4v16M4.802 10.455l7.2-6.453 7.2 6.453"
                : ""
      }
    />

  </Svg>
);
export default ArrowIcon;