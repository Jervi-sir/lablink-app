import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const SAVED_LABS = [
  { id: '1', name: 'Bio-Research Laboratory', type: 'Biological Sciences', university: 'USTHB', logo: '🧬', orders: 12 },
  { id: '2', name: 'NanoTech Center', type: 'Applied Physics', university: 'University of Algiers', logo: '🔬', orders: 8 },
  { id: '3', name: 'ChemLab Algiers', type: 'Chemical Engineering', university: 'USTHB', logo: '🧪', orders: 5 },
  { id: '4', name: 'Genomics Hub', type: 'Genetics', university: 'University of Constantine', logo: '🧬', orders: 3 },
  { id: '5', name: 'Optics & Photonics Lab', type: 'Physics', university: 'University of Oran', logo: '🔦', orders: 7 },
];

export default function StudentSavedBusinessesScreen() {
  const navigation = useNavigation<any>();

  const renderLab = ({ item }: { item: typeof SAVED_LABS[0] }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
      }}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 24 }}>{item.logo}</Text>
        </View>
        <View style={{ gap: 4, flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{item.name}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>{item.university}</Text>
          <View style={{ backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>{item.type}</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 8 }}>
        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>🔖</Text>
        </View>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8' }}>{item.orders} Orders</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Saved Laboratories</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={SAVED_LABS}
        renderItem={renderLab}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>No saved laboratories yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

