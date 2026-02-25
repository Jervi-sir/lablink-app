import { View } from "react-native";
import Text from "../text";
import TouchableOpacity from "../touchable-opacity";

export const ProductCard2 = () => {
  return (
    <View style={{
      flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 16,
      gap: 10, borderRadius: 16,
      backgroundColor: '#fff',
    }}>
      <View style={{ width: 95, height: 95, backgroundColor: '#D9D9D9', borderRadius: 8 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: 400, color: '#475369' }}>Product name Product name Product name Product</Text>
        <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>Lab name</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111111' }}>4000 DA</Text>
          <TouchableOpacity
            style={{
              height: 24, width: 24, backgroundColor: '#E7F2FD', borderRadius: 100,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#137FEC', fontSize: 14, fontWeight: 600 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};