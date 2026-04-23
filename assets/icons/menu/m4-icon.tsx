import * as React from "react";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";

interface type {
  size?: number | 24,
  color?: string,
  isActive?: boolean | false
}

const M4Icon: React.FC<type> = ({ color = '#111', size = 24, isActive = false }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    {isActive
      ?
      <>
        <G clipPath="url(#a)">
          <Path
            fill="#111"
            d="M21 9.999V12.5c0 4.478 0 6.718-1.391 8.11C18.218 22 15.979 22 11.5 22c-4.478 0-6.718 0-8.109-1.39C2 19.217 2 16.98 2 12.5c0-4.478 0-6.718 1.391-8.109 1.391-1.39 3.63-1.39 8.109-1.39.53 0 2.03-.003 2.5-.002"
          />
          <Path
            stroke="#111"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 9.999V12.5c0 4.478 0 6.718-1.391 8.11C18.218 22 15.979 22 11.5 22c-4.478 0-6.718 0-8.109-1.39C2 19.217 2 16.98 2 12.5c0-4.478 0-6.718 1.391-8.109 1.391-1.39 3.63-1.39 8.109-1.39.53 0 2.03-.003 2.5-.002"
          />
          <Path
            fill="#F5F5F5"
            d="M24.15 4.973C24.15 7.83 22.859 9.5 20 9.5c-3 0-5.5-2.5-5.5-5.5 0-2.858 1.618-4.203 4.476-4.203a5.176 5.176 0 0 1 5.175 5.176"
          />
          <Circle cx={19.5} cy={4.5} r={2.5} stroke="#111" strokeWidth={2} />
          <Path
            stroke="#F5F5F5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m6 14.5 2.194-2.395c.701-.763 1.051-1.145 1.472-1.145s.772.382 1.472 1.145l.724.79c.7.763 1.05 1.145 1.472 1.145s.77-.382 1.472-1.145L17 10.5"
          />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="#fff" d="M0 0h24v24H0z" />
          </ClipPath>
        </Defs>
      </>
      :
      <>
        <Path
          stroke="#707070"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m6 14.5 2.194-2.395c.701-.763 1.051-1.145 1.472-1.145s.772.382 1.472 1.145l.724.79c.7.763 1.05 1.145 1.472 1.145s.77-.382 1.472-1.145L17 10.5"
        />
        <Path
          stroke="#707070"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.998 11 21 12.5c0 4.478 0 6.718-1.391 8.109S15.979 22 11.5 22c-4.478 0-6.718 0-8.109-1.391S2 16.979 2 12.5c0-4.478 0-6.718 1.391-8.109S7.021 3 11.5 3q.795 0 1.5.002"
        />
        <Circle cx={19.5} cy={4.5} r={2.5} stroke="#707070" strokeWidth={2} />

      </>
    }
  </Svg>
);
export default M4Icon;