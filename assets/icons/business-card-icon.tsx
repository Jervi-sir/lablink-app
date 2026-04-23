import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'open',
  size?: number | 24,
  color?: string
}

const BusinessCardIcon: React.FC<type> = ({ type = 'open', color = '#111', size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <>
      <Path
        fill="#000"
        d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-3 12H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-7-8H8a2 2 0 0 0-1.995 1.85L6 9v2a2 2 0 0 0 1.85 1.995L8 13h2a2 2 0 0 0 1.995-1.85L12 11V9a2 2 0 0 0-1.85-1.995zm7 4h-3a1 1 0 0 0-.117 1.993L14 13h3a1 1 0 0 0 .117-1.993zm-7-2v2H8V9zm7-2h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2"
      />
    </>
  </Svg>
);
export default BusinessCardIcon;