import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'open',
  size?: number | 24,
  color?: string
}

const StatsIcon: React.FC<type> = ({ type = 'open', color = '#111', size = 24 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <>
      <Path
        fill="#000"
        d="M7 17h2v-5H7zm8 0h2V7h-2zm-4 0h2v-3h-2zm0-5h2v-2h-2zm-6 9q-.824 0-1.412-.587A1.93 1.93 0 0 1 3 19V5q0-.824.588-1.412A1.93 1.93 0 0 1 5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413A1.92 1.92 0 0 1 19 21z"
      />
    </>
  </Svg>
);
export default StatsIcon;