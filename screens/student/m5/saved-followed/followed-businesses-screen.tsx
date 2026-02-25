import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet } from "react-native";
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
      style={styles.facilityCard}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
      activeOpacity={0.8}
    >
      <View style={styles.facilityLeft}>
        <View style={styles.logoBg}>
          <Text style={styles.logoEmoji}>{item.logo}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.facilityName}>{item.name}</Text>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW UPDATE</Text>
              </View>
            )}
          </View>
          <Text style={styles.university}>{item.university}</Text>
          <Text style={styles.followersText}>👥 {item.followers} researchers following</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followingBtn}>
        <Text style={styles.followingBtnText}>Following</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Followed Facilities</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={FOLLOWED_FACILITIES}
        renderItem={renderFacility}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No followed facilities yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8FAFC' },
  header: {
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100 },
  facilityCard: {
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
  },
  facilityLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  logoBg: { width: 60, height: 60, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  logoEmoji: { fontSize: 26 },
  info: { gap: 2, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  facilityName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  newBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newBadgeText: { fontSize: 8, fontWeight: '800', color: '#16A34A' },
  university: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  followersText: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4 },
  followingBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  followingBtnText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  emptyContainer: { flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748B', fontWeight: '600', fontSize: 15 }
});
