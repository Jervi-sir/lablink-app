import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function InventoryAnalyticsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Analytics</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainStats}>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>STOCK HEALTH</Text>
            <Text style={styles.statVal}>94%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '94%' }]} />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Most Viewed</Text>
            <Text style={styles.cardVal}>Microscope X1</Text>
            <Text style={styles.cardSub}>+12% this week</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Low Stock Items</Text>
            <Text style={styles.cardVal}>3</Text>
            <Text style={styles.cardSub}>Needs attention</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance over time</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>Analytics Chart Visualisation</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  mainStats: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  statVal: { fontSize: 24, fontWeight: '900', color: '#8B5CF6' },
  progressBar: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#8B5CF6' },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 },
  cardVal: { fontSize: 16, fontWeight: '800', color: '#111' },
  cardSub: { fontSize: 11, color: '#10B981', fontWeight: '600', marginTop: 4 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 },
  chartPlaceholder: { height: 200, backgroundColor: '#FFF', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  chartText: { color: '#94A3B8', fontWeight: '600' }
});
