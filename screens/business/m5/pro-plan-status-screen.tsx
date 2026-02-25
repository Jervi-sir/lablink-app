import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function ProPlanStatusScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pro Plan Status</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planLabel}>CURRENT PLAN</Text>
              <Text style={styles.planName}>LabLink Pro 🚀</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.expiryText}>Next billing date: <Text style={{ fontWeight: '800', color: '#FFF' }}>March 24, 2024</Text></Text>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Included Features</Text>
          <View style={styles.featureList}>
            {['Advanced Inventory Analytics', 'Unlimited Product Listings', 'Priority Support response', 'Custom Lab Branding', 'MSDS Document Hosting'].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.check}><Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text></View>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.manageBtn}>
          <Text style={styles.manageBtnText}>Manage Subscription</Text>
        </TouchableOpacity>
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
  planCard: { backgroundColor: '#8B5CF6', padding: 24, borderRadius: 28, marginBottom: 32 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '800', letterSpacing: 1 },
  planName: { fontSize: 24, fontWeight: '900', color: '#FFF', marginTop: 4 },
  activeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  divider: { height: 1.5, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  expiryText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  featureSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 },
  featureList: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  featureText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  manageBtn: { height: 58, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  manageBtnText: { color: '#8B5CF6', fontWeight: '800', fontSize: 16 }
});
