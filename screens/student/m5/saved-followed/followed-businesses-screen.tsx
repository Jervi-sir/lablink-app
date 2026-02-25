import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const FOLLOWED_FACILITIES = [
  { id: '1', name: 'NanoTech Center', type: 'Applied Physics', university: 'University of Algiers', logo: '🔬', followers: '1.2k', isNew: true },
  { id: '2', name: 'Bio-Research Laboratory', type: 'Biological Sciences', university: 'USTHB', logo: '🧬', followers: '2.5k', isNew: false },
  { id: '3', name: 'Genomics Hub', type: 'Genetics', university: 'University of Constantine', logo: '🧬', followers: '840', isNew: false },
  { id: '4', name: 'ChemLab Algiers', type: 'Chemical Engineering', university: 'USTHB', logo: '🧪', followers: '2.1k', isNew: true },
];

export default function StudentFollowedBusinessesScreen() {
  const navigation = useNavigation<any>();

  const renderFacility = ({ item }: { item: typeof FOLLOWED_FACILITIES[0] }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
      }}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
        <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 26 }}>{item.logo}</Text>
        </View>
        <View style={{ gap: 2, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{item.name}</Text>
            {item.isNew && (
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 8, fontWeight: '800', color: '#16A34A' }}>NEW UPDATE</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>{item.university}</Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4 }}>👥 {item.followers} researchers following</Text>
        </View>
      </View>
      <TouchableOpacity style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>Following</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Followed Facilities</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={FOLLOWED_FACILITIES}
        renderItem={renderFacility}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>No followed facilities yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

