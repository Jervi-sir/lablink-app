import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, Image, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const LAB_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: `${i}`,
  name: i % 2 === 0 ? 'Digital LCD Microscope' : 'Borosil Glass Beakers',
  price: i % 2 === 0 ? '45,000 DA' : '1,200 DA',
  image: null,
}));

const CONTACTS = [
  { id: '1', type: 'Location', value: '123 Science Park, University Campus', icon: '📍' },
  { id: '2', type: 'Phone', value: '+213 550 123 456', icon: '📞' },
  { id: '3', type: 'Email', value: 'contact@bio-research.dz', icon: '✉️' },
  { id: '4', type: 'Website', value: 'www.bio-research.dz', icon: '🌐' },
];

export default function BusinessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { labName = "Advanced Bio-Research Lab" } = route.params || {};

  const renderHeader = () => (
    <View style={{ padding: 20 }}>
      {/* Bio & Intro Section */}
      <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' }}>
            <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#D1D5DB' }} />
            <View style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111' }}>{labName}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>✓ VERIFIED</Text>
              </View>
              <View style={{ backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#D97706' }}>★ 4.9</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>1.2k</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Sales</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>450</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Rentals</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>98%</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Uptime</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>About Facility</Text>
        <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', marginTop: 8 }}>
          Established in 2018, our Advanced Bio-Research Laboratory provides cutting-edge genomics and biochemical analysis services.
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 24 }}>📜</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>Operating License #DZ-2024-99</Text>
            <Text style={{ fontSize: 11, color: '#64748B' }}>Ministry of Higher Education</Text>
          </View>
        </View>
      </View>

      {/* Specializations */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Expertise</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {['Genomics', 'Proteomics', 'Bio-Safety L3', 'HPLC Analysis'].map((item) => (
            <View key={item} style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#EEF2FF', borderRadius: 10, borderWidth: 1, borderColor: '#E0E7FF' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#4F46E5' }}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Connectivity */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Connectivity</Text>
        <View style={{ marginTop: 12, gap: 12 }}>
          {CONTACTS.map((contact) => (
            <View key={contact.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 16 }}>{contact.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{contact.type}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E293B' }}>{contact.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Area */}
      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
        <TouchableOpacity style={{ flex: 1, height: 50, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Book Appointment</Text></TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, height: 50, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Message</Text></TouchableOpacity>
      </View>

      {/* Products Header */}
      <View style={{ marginTop: 24, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Available Equipment</Text>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.LabProductsScreen, { labName })}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ width: COLUMN_WIDTH, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' }}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: { ...item, lab: labName } })}
    >
      <View style={{ height: COLUMN_WIDTH, backgroundColor: '#F8FAFC' }} />
      <View style={{ padding: 12, gap: 2 }}>
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{item.price}</Text>
        <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Floating Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{labName}</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={LAB_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => console.log('Load more products')}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
}

