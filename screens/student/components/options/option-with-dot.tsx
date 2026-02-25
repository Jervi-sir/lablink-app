import React from "react";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ViewStyle } from "react-native";

interface OptionWithDotProps {
  label: string;
  value: boolean;
  onValueChange: () => void;
  style?: ViewStyle;
}

export const OptionWithDot: React.FC<OptionWithDotProps> = ({
  label,
  value,
  onValueChange,
  style
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: 18,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F1F5F9'
        },
        value && { borderColor: '#137FEC', backgroundColor: '#F0F7FF' },
        style
      ]}
      onPress={onValueChange}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{label}</Text>
      {value && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#137FEC' }} />}
    </TouchableOpacity>
  );
};