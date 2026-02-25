import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const HISTORY = [
  { id: '1', date: 'Feb 20, 2024', amount: '124,500 DA', status: 'Completed', ref: 'PAY-88221' },
  { id: '2', date: 'Feb 15, 2024', amount: '89,200 DA', status: 'Completed', ref: 'PAY-88210' },
  { id: '3', date: 'Feb 10, 2024', amount: '45,000 DA', status: 'Completed', ref: 'PAY-88198' },
  { id: '4', date: 'Feb 05, 2024', amount: '210,000 DA', status: 'Pending', ref: 'PAY-88155' },
];

export default function PayoutHistoryScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Payout History</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={HISTORY}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ backgroundColor: '#111', padding: 24, borderRadius: 28, marginBottom: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Current Balance</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFF', marginVertical: 12 }}>210,000 DA</Text>
            <TouchableOpacity style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 8 }}>
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>Request Withdrawal</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18 }}>🏦</Text></View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{item.amount}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{item.date} • {item.ref}</Text>
              </View>
            </View>
            <View style={[{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }, item.status === 'Pending' && { backgroundColor: '#FFF7ED' }]}>
              <Text style={[{ fontSize: 10, fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }, item.status === 'Pending' && { color: '#F59E0B' }]}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

