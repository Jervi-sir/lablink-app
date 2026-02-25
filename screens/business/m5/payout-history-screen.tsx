import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
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
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payout History</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={HISTORY}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.balanceCard}>
            <Text style={styles.balLabel}>Current Balance</Text>
            <Text style={styles.balVal}>210,000 DA</Text>
            <TouchableOpacity style={styles.requestBtn}>
              <Text style={styles.requestText}>Request Withdrawal</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.payoutRow}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}><Text style={{ fontSize: 18 }}>🏦</Text></View>
              <View>
                <Text style={styles.rowTitle}>{item.amount}</Text>
                <Text style={styles.rowDate}>{item.date} • {item.ref}</Text>
              </View>
            </View>
            <View style={[styles.statusTag, item.status === 'Pending' && styles.pendingTag]}>
              <Text style={[styles.statusText, item.status === 'Pending' && styles.pendingText]}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingBottom: 40 },
  balanceCard: { backgroundColor: '#111', padding: 24, borderRadius: 28, marginBottom: 32, alignItems: 'center' },
  balLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  balVal: { fontSize: 32, fontWeight: '900', color: '#FFF', marginVertical: 12 },
  requestBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 8 },
  requestText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  rowDate: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 },
  statusTag: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#10B981', textTransform: 'uppercase' },
  pendingTag: { backgroundColor: '#FFF7ED' },
  pendingText: { color: '#F59E0B' }
});
