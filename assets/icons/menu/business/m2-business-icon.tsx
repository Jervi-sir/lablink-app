import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}


const M2BusinessIcon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
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
          d="M20 8H4V6h16zm-2-6H6v2h12zm4 10v8a2 2 0 0 1-2 2H4a2.006 2.006 0 0 1-2-2v-8a2.006 2.006 0 0 1 2-2h16a2.006 2.006 0 0 1 2 2"
        />

      </>
      :
      <>
        <Path
          stroke="#000"
          strokeWidth={1.5}
          d="m19.998 10.75.123.007a1.255 1.255 0 0 1 1.129 1.245V20A1.25 1.25 0 0 1 20 21.25H4.002a1.256 1.256 0 0 1-1.245-1.129l-.007-.123v-7.996a1.255 1.255 0 0 1 1.129-1.245l.123-.007zm-.748-4v.5H4.75v-.5zm-2-4v.5H6.75v-.5z"
        />

      </>}
  </Svg>
);
export default M2BusinessIcon;