import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const SAVED_LABS = [
  { id: '1', name: 'Bio-Research Laboratory', type: 'Biological Sciences', university: 'USTHB', logo: '🧬', orders: 12 },
  { id: '2', name: 'NanoTech Center', type: 'Applied Physics', university: 'University of Algiers', logo: '🔬', orders: 8 },
  { id: '3', name: 'ChemLab Algiers', type: 'Chemical Engineering', university: 'USTHB', logo: '🧪', orders: 5 },
  { id: '4', name: 'Genomics Hub', type: 'Genetics', university: 'University of Constantine', logo: '🧬', orders: 3 },
  { id: '5', name: 'Optics & Photonics Lab', type: 'Physics', university: 'University of Oran', logo: '🔦', orders: 7 },
];

export default function StudentSavedBusinessesScreen() {
  const navigation = useNavigation<any>();

  const renderLab = ({ item }: { item: typeof SAVED_LABS[0] }) => (
    <TouchableOpacity
      style={styles.labCard}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
      activeOpacity={0.8}
    >
      <View style={styles.labLeft}>
        <View style={styles.logoBg}>
          <Text style={styles.logoEmoji}>{item.logo}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.labName}>{item.name}</Text>
          <Text style={styles.university}>{item.university}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.type}</Text>
          </View>
        </View>
      </View>
      <View style={styles.labRight}>
        <View style={styles.savedIcon}>
          <Text style={{ fontSize: 16 }}>🔖</Text>
        </View>
        <Text style={styles.ordersText}>{item.orders} Orders</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Laboratories</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={SAVED_LABS}
        renderItem={renderLab}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved laboratories yet.</Text>
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
  labCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  labLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  logoBg: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  logoEmoji: { fontSize: 24 },
  info: { gap: 4, flex: 1 },
  labName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  university: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tag: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  tagText: { fontSize: 10, fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
  labRight: { alignItems: 'flex-end', gap: 8 },
  savedIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
  ordersText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  emptyContainer: { flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748B', fontWeight: '600', fontSize: 15 }
});
