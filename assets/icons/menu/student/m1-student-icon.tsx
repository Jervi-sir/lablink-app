import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}


const M1StudentIcon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
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
          fill="#000"
          d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.223a1 1 0 0 1 1.228 0l8 6.223a1 1 0 0 1 .386.79z"
        />

      </>
      :
      <>
        <Path
          stroke="#000"
          strokeWidth={1.5}
          d="M12 3.016a.25.25 0 0 1 .153.053l8 6.223a.25.25 0 0 1 .097.198V20a.25.25 0 0 1-.25.25H4a.25.25 0 0 1-.25-.25V9.49l.007-.057a.25.25 0 0 1 .09-.141l8-6.223A.25.25 0 0 1 12 3.016Z"
        />

      </>}
  </Svg>
);
export default M1StudentIcon;