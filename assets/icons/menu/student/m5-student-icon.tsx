import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}


const M5StudentIcon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
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
          d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
        />

      </>
      :
      <>
        <Path
          stroke={color}
          strokeWidth={2}
          d="M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 14c2.07 0 3.894.474 5.166 1.19C18.469 15.923 19 16.78 19 17.5c0 1.33-.054 1.936-.632 2.406-.327.267-.903.55-1.941.76-1.034.21-2.461.334-4.427.334s-3.392-.125-4.427-.334c-1.038-.21-1.614-.493-1.941-.76C5.054 19.436 5 18.83 5 17.5c0-.72.53-1.577 1.834-2.31C8.106 14.474 9.931 14 12 14Z"
        />

      </>}
  </Svg>
);
export default M5StudentIcon;