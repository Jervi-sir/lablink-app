import React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle, TouchableOpacityProps } from "react-native";

interface ButtonTagProps extends TouchableOpacityProps {
  label: string;
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ButtonTag: React.FC<ButtonTagProps> = ({
  label,
  isActive = false,
  onPress,
  style,
  textStyle,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[{
        height: 28,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: isActive ? '#137FEC' : '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
      }, style]}
      {...rest}
    >
      <Text style={[{
        color: isActive ? '#FFF' : '#111',
        fontWeight: '700',
        fontSize: 13
      }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};