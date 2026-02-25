import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { BusinessCard2 } from "../../components/cards/business-card-2";

const FOLLOWED_FACILITIES = [
  { id: '1', name: 'NanoTech Center', type: 'Applied Physics', university: 'University of Algiers', logo: '🔬', followers: '1.2k', isNew: true },
  { id: '2', name: 'Bio-Research Laboratory', type: 'Biological Sciences', university: 'USTHB', logo: '🧬', followers: '2.5k', isNew: false },
  { id: '3', name: 'Genomics Hub', type: 'Genetics', university: 'University of Constantine', logo: '🧬', followers: '840', isNew: false },
  { id: '4', name: 'ChemLab Algiers', type: 'Chemical Engineering', university: 'USTHB', logo: '🧪', followers: '2.1k', isNew: true },
];

export default function StudentFollowedBusinessesScreen() {
  const navigation = useNavigation<any>();

  const renderFacility = ({ item }: { item: typeof FOLLOWED_FACILITIES[0] }) => (
    <BusinessCard2
      business={item}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
    />
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

