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
          fill="#000"
          d="M12 11h2v2h-2v2h2v2h-2v2h8V9h-8zm4 0h2v2h-2zm0 4h2v2h-2z"
        />
        <Path
          fill="#000"
          d="M22 7H12V3H2v18h20zM6 19H4v-2h2zm0-4H4v-2h2zm0-4H4V9h2zm0-4H4V5h2zm4 12H8v-2h2zm0-4H8v-2h2zm0-4H8V9h2zm0-4H8V5h2zm10 12h-8V9h8z"
        />
      </>
      :
      <>
        <Path
          fill="#000"
          d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"
        />
      </>}
  </Svg>
);
export default M5StudentIcon;