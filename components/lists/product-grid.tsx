import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import { ProductCard1 } from "@/components/cards/product-card-1";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface ProductGridProps {
  products: any[];
  onProductPress: (product: any) => void;
  onToggleSave?: (id: string) => void | Promise<void>;
  savingProductId?: string | null;
  paddingHorizontal?: number;
  isLoading?: boolean;
}

const ProductSkeleton = () => (
  <View style={{
    width: COLUMN_WIDTH,
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  }}>
    <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12 }} />
    <View style={{ height: 14, backgroundColor: '#F8FAFC', borderRadius: 4, width: '80%', marginBottom: 8 }} />
    <View style={{ height: 10, backgroundColor: '#F8FAFC', borderRadius: 4, width: '40%', marginBottom: 12 }} />
    <View style={{ height: 18, backgroundColor: '#F8FAFC', borderRadius: 4, width: '60%' }} />
  </View>
);

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onToggleSave,
  savingProductId,
  paddingHorizontal = 0,
  isLoading = false
}) => {
  const renderItem = ({ item }: { item: any }) => {
    if (isLoading) return <ProductSkeleton />;

    return (
      <ProductCard1
        product={{
          ...item,
          lab: item.business?.name || item.lab || 'Unknown Lab',
          price: typeof item.price === 'string' ? item.price : `${item.price.toLocaleString()} DA`
        }}
        onPress={() => onProductPress(item)}
        onToggleSave={() => onToggleSave?.(item.id.toString())}
        isSaving={savingProductId === item.id.toString()}
        style={{ marginBottom: 16 }}
      />
    );
  };

  const data = isLoading ? [1, 2, 3, 4, 5, 6] : products;

  return (
    <FlatList
      data={data as any}
      keyExtractor={(item, index) => isLoading ? `skeleton-${index}` : item.id.toString()}
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
