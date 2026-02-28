import React from "react";
import { View, TouchableOpacity, Text, ViewStyle, Image } from "react-native";

interface Lab {
  id: string;
  name: string;
  logo?: string;
}

interface BusinessCard1Props {
  lab: Lab;
  onPress?: () => void;
  style?: ViewStyle;
}

export const BusinessCard1: React.FC<BusinessCard1Props> = ({ lab, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[{ alignItems: 'center', gap: 8 }, style]}
    >
      <View style={{
        width: 64,
        height: 64,
        backgroundColor: '#F3F4F6',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {lab.logo ? (
          <Image source={{ uri: lab.logo }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <View style={{ width: 30, height: 30, backgroundColor: '#D1D5DB', borderRadius: 15 }} />
        )}
      </View>
      <Text style={{ fontSize: 12, color: '#111', fontWeight: '600', textAlign: 'center', width: 72 }} numberOfLines={2}>{lab.name}</Text>
    </TouchableOpacity>
  );
};