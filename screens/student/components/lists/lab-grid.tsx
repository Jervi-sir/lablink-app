import React from "react";
import { View, FlatList } from "react-native";
import { LabCard1 } from "../cards/lab-card-1";

interface LabGridProps {
  labs: any[];
  onLabPress: (lab: any) => void;
  paddingHorizontal?: number;
}

export const LabGrid: React.FC<LabGridProps> = ({
  labs,
  onLabPress,
  paddingHorizontal = 0
}) => {
  const renderItem = ({ item }: { item: any }) => (
    <LabCard1
      lab={item}
      onPress={() => onLabPress(item)}
    />
  );

  return (
    <FlatList
      data={labs}
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
