import { StyleProp, TextStyle, ViewStyle } from "react-native";
import TouchableOpacity from "../touchable-opacity";
import Text from "../text";

interface Button1Props {
  text?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Button1 = ({
  text = "Continue",
  onPress,
  style,
  textStyle,
  disabled
}: Button1Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          height: 48,
          backgroundColor: '#137FEC',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center'
        },
        style
      ]}
    >
      <Text style={[{ fontSize: 18, fontWeight: '700', color: '#F5F5F5' }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};