import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

export default function BusinessStudentProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { student = {
    name: 'Amine Kerroum',
    online: true,
    avatar: '👨‍🔬',
    role: 'PhD Researcher',
    department: 'Molecular Biology',
    university: 'USTHB University',
    bio: 'Specializing in advanced microscopy and genetic sequencing. Currently leading the Bio-Imaging project at Faculty of Biological Sciences.',
    ordersCount: 12,
    rating: 4.9,
    since: 'Oct 2023'
  } } = route.params || {};

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Researcher Profile</Text>
        <TouchableOpacity
          style={styles.msgBtn}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, {
            chat: { name: student.name, online: true, avatar: student.avatar }
          })}
        >
          <Text style={{ fontSize: 20 }}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarHolder}>
            <View style={styles.avatarLarge}>
              <Text style={{ fontSize: 48 }}>{student.avatar || '🧪'}</Text>
            </View>
            {student.online && <View style={styles.onlineStatus} />}
          </View>
          <Text style={styles.nameText}>{student.name}</Text>
          <Text style={styles.roleText}>{student.role}</Text>
          <View style={styles.uniBadge}>
            <Text style={styles.uniBadgeText}>{student.university}</Text>
          </View>
        </View>

        {/* Business Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{student.ordersCount}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{student.rating}</Text>
            <Text style={styles.statLabel}>Buyer Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{student.since}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Deep Info Sections */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About Researcher</Text>
          <View style={styles.contentCard}>
            <Text style={styles.bioText}>{student.bio}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Academic Department</Text>
          <View style={styles.contentCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={{ fontSize: 18 }}>🧬</Text>
              </View>
              <View>
                <Text style={styles.infoHeading}>{student.department}</Text>
                <Text style={styles.infoSubText}>Faculty of Biological Sciences</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action History Preview */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Recent Acquisition Status</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityRow}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>Last order processed successfully (ORD-8821)</Text>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  msgBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#FFF', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  avatarHolder: { position: 'relative', marginBottom: 16 },
  avatarLarge: { width: 110, height: 110, borderRadius: 40, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  onlineStatus: { position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' },
  nameText: { fontSize: 24, fontWeight: '900', color: '#111' },
  roleText: { fontSize: 15, fontWeight: '700', color: '#8B5CF6', marginTop: 4 },
  uniBadge: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  uniBadgeText: { fontSize: 12, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: -24, zIndex: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#111' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' },
  infoSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  contentCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  bioText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  infoHeading: { fontSize: 16, fontWeight: '800', color: '#111' },
  infoSubText: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 },
  activityCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  activityText: { flex: 1, fontSize: 14, color: '#475569', fontWeight: '600' },
  activityTime: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
});
