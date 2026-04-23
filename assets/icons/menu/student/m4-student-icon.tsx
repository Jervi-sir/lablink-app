import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}


const M4StudentIcon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
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
          d="M7.24 2.25h9.52a2.75 2.75 0 0 1 2.462 1.526 1 1 0 0 1 .051.135l2.163 7.846c.208.758.314 1.54.314 2.325V19A2.75 2.75 0 0 1 19 21.75H5A2.75 2.75 0 0 1 2.25 19v-4.918c0-.785.106-1.567.314-2.325l2.163-7.846a1 1 0 0 1 .051-.135A2.75 2.75 0 0 1 7.24 2.25m13.002 11.5H17.07a1.25 1.25 0 0 0-1.04.557l-.812 1.218a2.75 2.75 0 0 1-2.288 1.225h-1.86a2.75 2.75 0 0 1-2.288-1.225l-.812-1.218a1.25 1.25 0 0 0-1.04-.557H3.758a7 7 0 0 0-.008.332V19A1.25 1.25 0 0 0 5 20.25h14A1.25 1.25 0 0 0 20.25 19v-4.918q0-.165-.008-.332"
        />
      </>
      :
      <>
        <Path
          stroke={color}
          strokeWidth={1.5}
          d="M7.24 3h9.52a2 2 0 0 1 1.78 1.09h.001l.013.035 2.159 7.831q.141.515.213 1.044h-3.857a2 2 0 0 0-1.663.89l-.812 1.22a2 2 0 0 1-1.664.89h-1.86a2 2 0 0 1-1.592-.79l-.072-.1-.812-1.22h-.001A2 2 0 0 0 6.93 13H3.074q.072-.528.213-1.044l2.16-7.831.012-.034a2 2 0 0 1 1.642-1.086zM3 14.082Z"
        />
      </>}
  </Svg>
);
export default M4StudentIcon;