import React from "react";
import { View, Dimensions, Image } from "react-native";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

interface Lab {
  id: string;
  name: string;
  logo?: string;
  wilaya?: {
    name: string;
  };
}

interface LabCard1Props {
  lab: Lab;
  onPress: () => void;
  width?: number;
}

export const LabCard1: React.FC<LabCard1Props> = ({ lab, onPress, width = COLUMN_WIDTH }) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
      }}
      onPress={onPress}
    >
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' }}>
        {lab.logo ? (
          <Image source={{ uri: lab.logo }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Text style={{ fontSize: 32 }}>🏢</Text>
        )}
      </View>
      <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', textAlign: 'center' }} numberOfLines={1}>{lab.name}</Text>
      <Text style={{ fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4, textTransform: 'uppercase' }}>{lab.wilaya?.name || 'Laboratory'}</Text>
    </TouchableOpacity>
  );
};
