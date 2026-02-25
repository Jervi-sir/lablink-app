import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

import { BusinessCard2 } from "../../components/cards/business-card-2";

const SAVED_LABS = [
  { id: '1', name: 'Bio-Research Laboratory', university: 'USTHB', logo: '🧬', followers: '1.2k', isNew: true },
  { id: '2', name: 'NanoTech Center', university: 'University of Algiers', logo: '🔬', followers: '850', isNew: false },
  { id: '3', name: 'ChemLab Algiers', university: 'USTHB', logo: '🧪', followers: '500', isNew: false },
  { id: '4', name: 'Genomics Hub', university: 'University of Constantine', logo: '🧬', followers: '2.1k', isNew: true },
  { id: '5', name: 'Optics & Photonics Lab', university: 'University of Oran', logo: '🔦', followers: '320', isNew: false },
];

export default function StudentSavedBusinessesScreen() {
  const navigation = useNavigation<any>();

  const renderLab = ({ item }: { item: any }) => (
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

