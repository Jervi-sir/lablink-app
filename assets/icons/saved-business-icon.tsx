import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const SavedBusinessIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M2 20v-6H1v-2l1-5h15l1 4h-2c-1.153 0-2 1-2 2v1h-3v6zm7-2H4v-4h5zM1.847 4v2h15V4z"
      clipRule="evenodd"
    />
    <Path
      fill="#000"
      d="M19.5 12c.663 0 1.299.237 1.768.659s.732.994.732 1.59v6.3a.4.4 0 0 1-.071.232.5.5 0 0 1-.193.165.55.55 0 0 1-.514-.022L18.5 19.291l-2.722 1.633a.54.54 0 0 1-.489.034.5.5 0 0 1-.195-.145.42.42 0 0 1-.091-.213L15 20.55v-6.3c0-.597.263-1.17.732-1.591A2.65 2.65 0 0 1 17.5 12z"
    />
  </Svg>
);
export default SavedBusinessIcon;