import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

const fontWeightToFontFamily = {
  '400': 'PlusJakartaSans_400Regular',
  '500': 'PlusJakartaSans_500Medium',
  '600': 'PlusJakartaSans_600SemiBold',
  '700': 'PlusJakartaSans_700Bold',
  '800': 'PlusJakartaSans_800ExtraBold'
};

type CustomTextProps = RNTextProps & {
  style?: StyleProp<TextStyle>;
  capitalize?: boolean;
};

const Text: React.FC<CustomTextProps> = ({ style, children, capitalize = true, ...rest }) => {
  // Extract the fontWeight from style
  const flattenedStyle = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style || {};

  const fontWeight = flattenedStyle?.fontWeight?.toString() ?? '400';
  const fontFamily =
    // @ts-ignore
    fontWeightToFontFamily[fontWeight] || fontWeightToFontFamily['400'];

  let formattedText = children;

  if (capitalize && typeof children === "string") {
    const lower = children.toLowerCase();
    formattedText = lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    <RNText
      {...rest}
      style={[
        {
          fontSize: 13,
          fontWeight: 600,
          fontFamily,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}
    >
      {formattedText}
    </RNText>
  );
};

export default Text;
