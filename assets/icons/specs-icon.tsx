import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const SpecsIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      d="M4 20q-.824 0-1.412-.587A1.93 1.93 0 0 1 2 18V6q0-.824.588-1.412A1.93 1.93 0 0 1 4 4h5.175a1.98 1.98 0 0 1 1.4.575L12 6h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413A1.92 1.92 0 0 1 20 20zm10.9-5.05 1.7 1.275q.15.125.288.025t.087-.275l-.625-2.125 1.75-1.4a.27.27 0 0 0 .075-.288q-.05-.163-.225-.162H15.8l-.65-2.05q-.05-.175-.25-.175t-.25.175L14 12h-2.15q-.176 0-.225.162a.27.27 0 0 0 .075.288l1.75 1.4-.625 2.125q-.05.175.087.275.136.1.288-.025z"
    />
  </Svg>
);
export default SpecsIcon;