import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import { ProductCard1 } from "../cards/product-card-1";

const { width } = Dimensions.get('window');

interface ProductGridProps {
  products: any[];
  onProductPress: (product: any) => void;
  onToggleSave: (id: string) => void;
  savingProductId?: string | null;
  paddingHorizontal?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onToggleSave,
  savingProductId,
  paddingHorizontal = 0
}) => {
  const renderItem = ({ item }: { item: any }) => (
    <ProductCard1
      product={{
        ...item,
        lab: item.business?.name || item.lab || 'Unknown Lab',
        price: typeof item.price === 'string' ? item.price : `${item.price.toLocaleString()} DA`
      }}
      onPress={() => onProductPress(item)}
      onToggleSave={() => onToggleSave(item.id.toString())}
      isSaving={savingProductId === item.id.toString()}
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      renderItem={renderItem}
      scrollEnabled={false}
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}
      contentContainerStyle={{ paddingVertical: 8 }}
      showsVerticalScrollIndicator={false}
      style={{ width: '100%' }}
    />
  );
};
