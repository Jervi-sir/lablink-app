import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";

const DOCUMENTS = [
  { id: '1', title: '2023 Annual Tax Summary', date: 'Jan 15, 2024', size: '2.4 MB' },
  { id: '2', title: 'VAT Declaration - Q4 2023', date: 'Jan 10, 2024', size: '1.1 MB' },
  { id: '3', title: 'W-8BEN-E Form', date: 'Dec 03, 2023', size: '0.8 MB' },
  { id: '4', title: '2022 Annual Tax Summary', date: 'Jan 18, 2023', size: '2.2 MB' },
];

export default function TaxDocumentsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Tax Documents</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={DOCUMENTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 24 }}>📄</Text></View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 4 }}>{item.date} • {item.size}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>📥</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}
