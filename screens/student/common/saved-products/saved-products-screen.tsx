import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";

const SAVED_PRODUCTS = [
  { id: '1', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '2', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '3', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
];

export default function SavedProductsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F2F5' }}>
        <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#111', transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ gap: 16 }}>
          {SAVED_PRODUCTS.map((product) => (
            <View key={product.id} style={{ flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 12, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
              {/* Image Placeholder */}
              <View style={{ width: 95, height: 95, backgroundColor: '#D9D9D9', borderRadius: 12 }} />

              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }} numberOfLines={2}>
                    {product.name}
                  </Text>

                  {/* Lab Pill */}
                  <View style={{ backgroundColor: '#E9F7EF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ color: '#27AE60', fontSize: 11, fontWeight: '600' }}>{product.lab}</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{product.price}</Text>

                  <TouchableOpacity style={{ backgroundColor: '#E0E0E0', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}