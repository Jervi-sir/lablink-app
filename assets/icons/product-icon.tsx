import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface type {
  type?: 'left' | 'right' | 'down' | 'up',
  stroke?: number | 1.2;
  size?: number | 24,
  color?: string
}

const ProductIcon: React.FC<type> = ({ type = 'left', color = '#111', size = 24, stroke = 1.2 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      fill="#000"
      fillRule="evenodd"
      d="m12 1.61 9 5.196v10.392l-9 5.197-9-5.196V6.805zm-3 9.7v7.043l2 1.155v-7.044zM5 9v7.044l2 1.155v-7.044zm10.937-2.807-5.886 3.414L12 10.732l5.9-3.406zM12 3.919 6.1 7.326l1.953 1.127 5.886-3.414z"
      clipRule="evenodd"
    />
  </Svg>
);
export default ProductIcon;