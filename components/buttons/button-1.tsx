import { ActivityIndicator, StyleProp, TextStyle, ViewStyle } from "react-native";
import TouchableOpacity from "../touchable-opacity";
import Text from "../text";

interface Button1Props {
  text?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}

export const Button1 = ({
  text = "Continue",
  onPress,
  style,
  textStyle,
  disabled,
  loading
}: Button1Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          height: 48,
          backgroundColor: '#137FEC',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center'
        },
        style,
        (disabled || loading) && { opacity: 0.7 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#F5F5F5" />
      ) : (
        <Text style={[{ fontSize: 18, fontWeight: '700', color: '#F5F5F5' }, textStyle]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};