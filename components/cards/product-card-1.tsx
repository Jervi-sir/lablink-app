import { View } from "react-native";
import Text from "../text";
import TouchableOpacity from "../touchable-opacity";

export const ProductCard1 = () => {
  return (
    <View style={{
      gap: 10, paddingTop: 10, width: 180,
    }}>
      <View style={{ width: 176, height: 176, backgroundColor: '#D9D9D9', borderRadius: 8 }} />
      <View>
        <Text style={{ fontSize: 10, fontWeight: 400, color: '#475369' }}>Labo name</Text>
        <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>Digital LCD Microscope</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#111111' }}>100 DA</Text>
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