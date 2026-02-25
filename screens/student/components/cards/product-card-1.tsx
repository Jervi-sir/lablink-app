import React from "react";
import { View, TouchableOpacity, Text, Dimensions, ViewStyle } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_COLUMN_WIDTH = (SCREEN_WIDTH - 48 - 16) / 2;

interface Product {
  id: string;
  name: string;
  lab: string;
  price: string;
}

interface ProductCard1Props {
  product: Product;
  onPress?: () => void;
  width?: number;
  style?: ViewStyle;
}

export const ProductCard1: React.FC<ProductCard1Props> = ({
  product,
  onPress,
  width = DEFAULT_COLUMN_WIDTH,
  style
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[{
        width: width,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
      }, style]}
    >
      {/* Image Area */}
      <View style={{ height: width, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        {/* Heart/Favorite Icon Placeholder */}
        <TouchableOpacity style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(255,255,255,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        }}>
          <View style={{ width: 14, height: 12, backgroundColor: '#9CA3AF', borderRadius: 2 }} />
        </TouchableOpacity>
        {/* Main Image Icon Placeholder could go here */}
        <View style={{ width: 40, height: 40, backgroundColor: '#D1D5DB', borderRadius: 8 }} />
      </View>

      {/* Details Area */}
      <View style={{ padding: 12, gap: 4 }}>
        <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>{product.lab}</Text>
        <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }} numberOfLines={2}>{product.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 14, color: '#111', fontWeight: '800' }}>{product.price}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#137FEC',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};