import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}


const M3StudentIcon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    {isActive
      ?
      <>
        <Path
          fill={color}
          d="M2.787 2.28a.75.75 0 0 1 .932.507l.55 1.863h14.655c1.84 0 3.245 1.717 2.715 3.51l-1.655 5.6c-.352 1.193-1.471 1.99-2.715 1.99H8.113c-1.244 0-2.362-.797-2.715-1.99L2.281 3.212a.75.75 0 0 1 .506-.932M6.25 19.5a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0m8 0a2.252 2.252 0 0 1 3.111-2.079 2.248 2.248 0 0 1 .73 3.67A2.25 2.25 0 0 1 14.25 19.5"
        />
      </>
      :
      <>
        <Path
          stroke={color}
          strokeWidth={1.5}
          d="M8.5 18a1.5 1.5 0 1 1 0 3.002A1.5 1.5 0 0 1 8.5 18Zm8 0a1.5 1.5 0 1 1-.001 3 1.5 1.5 0 0 1 .001-3Zm2.424-12.6c1.383 0 2.371 1.276 1.995 2.547l-1.654 5.6v.001c-.253.858-1.068 1.452-1.996 1.452H8.113c-.928 0-1.741-.594-1.995-1.453L3.709 5.4z"
        />

      </>}
  </Svg>
);
export default M3StudentIcon;