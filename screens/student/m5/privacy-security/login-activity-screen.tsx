import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const ACTIVITIES = [
  { device: 'iPhone 15 Pro', location: 'Algiers, DZ', time: 'Active now', isCurrent: true },
  { device: 'MacBook Pro 14"', location: 'Algiers, DZ', time: '2 hours ago', isCurrent: false },
  { device: 'Chrome on Windows', location: 'Oran, DZ', time: 'Yesterday, 14:20', isCurrent: false },
];

export default function LoginActivityScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login Activity</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Where you're logged in</Text>
        <View style={styles.card}>
          {ACTIVITIES.map((item, index) => (
            <View key={index} style={[styles.item, index === ACTIVITIES.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.itemLeft}>
                <View style={styles.deviceIconBg}>
                  <Text>{item.device.includes('iPhone') ? '📱' : item.device.includes('Mac') ? '💻' : '🖥️'}</Text>
                </View>
                <View>
                  <Text style={styles.deviceName}>{item.device}{item.isCurrent && <Text style={styles.currentTag}> • Current</Text>}</Text>
                  <Text style={styles.deviceInfo}>{item.location} • {item.time}</Text>
                </View>
              </View>
              {!item.isCurrent && (
                <TouchableOpacity>
                  <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
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
  content: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 16, marginLeft: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deviceIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  deviceName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  currentTag: { color: '#10B981', fontSize: 12 },
  deviceInfo: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '700' }
});
