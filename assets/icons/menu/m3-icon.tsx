import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}

const M3Icon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
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
          fill="#111"
          fillRule="evenodd"
          d="m1.5 3.2 2 .3V6l1.25 9c.077.937 1.009 1.74 1.949 1.736H19.5a1.805 1.805 0 0 0 1.79-1.546L22 7.5c.106-.733-.268-1.394-1-1.5-.064-.009-17.5 0-17.5 0"
          clipRule="evenodd"
        />
        <Path
          stroke="#111"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m1.5 3.2 2 .3V6m0 0S20.936 5.991 21 6c.732.106 1.106.767 1 1.5l-.71 7.69a1.805 1.805 0 0 1-1.79 1.546H6.699c-.94.003-1.872-.799-1.949-1.736z"
        />
        <Path
          stroke="#F5F5F5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4"
        />
        <Path
          fill="#111"
          fillRule="evenodd"
          stroke="#111"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6.5 21a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M19.5 21a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"
          clipRule="evenodd"
        />
      </>
      :
      <>
        <Path
          stroke="#707070"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m1.5 3.2 2 .3V6m0 0S20.936 5.991 21 6c.732.106 1.106.767 1 1.5l-.71 7.69a1.805 1.805 0 0 1-1.79 1.546H6.699c-.94.003-1.872-.799-1.949-1.736zM14 10h4"
        />
        <Path
          fill="#707070"
          fillRule="evenodd"
          stroke="#707070"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6.5 21a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M19.5 21a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"
          clipRule="evenodd"
        />
      </>
    }

    {/*  */}


  </Svg>
);
export default M3Icon;