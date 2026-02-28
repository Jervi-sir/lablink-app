import SaveIcon from "@/assets/icons/save-icon";
import TouchableOpacity from "@/components/touchable-opacity";
import React from "react";
import { View, Text, Dimensions, ViewStyle, ActivityIndicator, Image } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_COLUMN_WIDTH = (SCREEN_WIDTH - 56) / 2;

interface Product {
  id: string;
  name: string;
  lab: string;
  price: string;
  isSaved?: boolean;
  images?: Array<{ url: string, isMain: boolean }>;
}

interface ProductCard1Props {
  product: Product;
  onPress?: () => void;
  onToggleSave?: () => void;
  isSaving?: boolean;
  width?: number;
  style?: ViewStyle;
}

export const ProductCard1: React.FC<ProductCard1Props> = ({
  product,
  onPress,
  onToggleSave,
  isSaving = false,
  width = DEFAULT_COLUMN_WIDTH,
  style
}) => {
  const mainImage = product.images?.find(i => i.isMain)?.url || product.images?.[0]?.url;

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
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: 40, height: 40, backgroundColor: '#D1D5DB', borderRadius: 8 }} />
        )}

        {/* Heart/Favorite Icon */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleSave?.();
          }}
          hitSlop={{ top: 10, left: 20, right: 10, bottom: 20 }}
          disabled={isSaving}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            zIndex: 10,
          }}
        >
          {isSaving ? (
            <ActivityIndicator size={12} color="#EF4444" />
          ) : (
            <SaveIcon isActive={product.isSaved} />
          )}
        </TouchableOpacity>
      </View>

      {/* Details Area */}
      <View style={{ padding: 12, gap: 4 }}>
        <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>{product.lab}</Text>
        <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }} numberOfLines={2}>{product.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '800' }}>{product.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};