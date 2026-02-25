import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Image } from "react-native";

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48 - 12) / 2;

const SPECIALIZATIONS = ['Organic Chemistry', 'Bioengineering', 'Genomics', 'PCR Analysis'];
const TABS = ['Products', 'Reviews', 'Certifications'];

const PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '2', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '3', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '4', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
];

export default function LabProfileScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Nav */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10 }}>
        <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#111', transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 20, height: 18, borderWidth: 2, borderColor: '#111', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 18, height: 18, borderWidth: 2, borderColor: '#111', borderRadius: 2 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Lab Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 16, marginTop: 8, marginBottom: 20 }}>
          <View style={{ width: 80, height: 80, backgroundColor: '#D9D9D9', borderRadius: 16 }} />
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>BioGen Laboratory</Text>
            <Text style={{ fontSize: 16, color: '#5D6575', fontWeight: '500' }}>Location</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E7F2FD', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 10, height: 16, backgroundColor: '#137FEC' }} />
            </View>
            <View>
              <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '600' }}>Response Time</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>&lt; 2hours</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 16, height: 16, backgroundColor: '#F59E0B' }} />
            </View>
            <View>
              <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '600' }}>Rating</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>4.7 (124)</Text>
            </View>
          </View>
        </View>

        {/* About Us */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>About us</Text>
          <Text style={{ fontSize: 14, color: '#5D6575', lineHeight: 20 }}>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
          </Text>
        </View>

        {/* Specialization */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Specialization</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SPECIALIZATIONS.map((spec) => (
              <View key={spec} style={{ backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F0F2F5', marginBottom: 16 }}>
          {TABS.map((tab, index) => (
            <TouchableOpacity key={tab} style={[{ flex: 1, paddingVertical: 12, alignItems: 'center' }, index === 0 && { borderBottomWidth: 2, borderBottomColor: '#137FEC' }]}>
              <Text style={[{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }, index === 0 && { color: '#137FEC' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 12 }}>
          {PRODUCTS.map((item) => (
            <View key={item.id} style={{ width: PRODUCT_CARD_WIDTH, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
              <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#1A2526' }}>
                <View style={{ flex: 1 }} />
                <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#111' }}>{item.tag}</Text>
                </View>
                <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 14, height: 12, backgroundColor: '#FFF', borderRadius: 2 }} />
                </TouchableOpacity>
              </View>
              <View style={{ padding: 12, gap: 4 }}>
                <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '500' }}>Labo name</Text>
                <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '800' }}>{item.price}</Text>
                  <TouchableOpacity style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E7F2FD', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#137FEC', fontWeight: '700', fontSize: 16 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Contact Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#F0F2F5' }}>
        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#137FEC', height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 16, height: 16, backgroundColor: '#FFF', borderRadius: 2 }} />
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Contact Lab</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

