import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import { LabCard1 } from "@/components/cards/lab-card-1";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface LabGridProps {
  labs: any[];
  onLabPress: (lab: any) => void;
  paddingHorizontal?: number;
  isLoading?: boolean;
}

const LabSkeleton = () => (
  <View style={{
    width: COLUMN_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  }}>
    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F8FAFC', marginBottom: 12 }} />
    <View style={{ height: 14, backgroundColor: '#F8FAFC', borderRadius: 4, width: '80%', marginBottom: 8 }} />
    <View style={{ height: 10, backgroundColor: '#F8FAFC', borderRadius: 4, width: '40%' }} />
  </View>
);

export const LabGrid: React.FC<LabGridProps> = ({
  labs,
  onLabPress,
  paddingHorizontal = 0,
  isLoading = false
}) => {
  const renderItem = ({ item }: { item: any }) => {
    if (isLoading) return <LabSkeleton />;

    return (
      <LabCard1
        lab={item}
        onPress={() => onLabPress(item)}
      />
    );
  };

  const data = isLoading ? [1, 2, 3, 4, 5, 6] : labs;

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
