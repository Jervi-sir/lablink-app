import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function OperatingHoursScreen() {
  const navigation = useNavigation<any>();
  const [hours, setHours] = useState([
    { day: 'Monday', enabled: true, open: '08:00', close: '17:00' },
    { day: 'Tuesday', enabled: true, open: '08:00', close: '17:00' },
    { day: 'Wednesday', enabled: true, open: '08:00', close: '17:00' },
    { day: 'Thursday', enabled: true, open: '08:00', close: '17:00' },
    { day: 'Friday', enabled: false, open: '08:00', close: '12:00' },
    { day: 'Saturday', enabled: false, open: 'Closed', close: 'Closed' },
    { day: 'Sunday', enabled: false, open: 'Closed', close: 'Closed' },
  ]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Operating Hours</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Set your lab's weekly schedule. This affects when orders can be processed and when customers see you as 'Open'.</Text>
        </View>

        <View style={styles.list}>
          {hours.map((item, idx) => (
            <View key={item.day} style={styles.dayRow}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{item.day}</Text>
                <Switch
                  value={item.enabled}
                  onValueChange={(v) => {
                    const newHours = [...hours];
                    newHours[idx].enabled = v;
                    setHours(newHours);
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
                />
              </View>
              {item.enabled && (
                <View style={styles.timeInputs}>
                  <TouchableOpacity style={styles.timeBox}><Text style={styles.timeText}>{item.open}</Text></TouchableOpacity>
                  <Text style={styles.sep}>to</Text>
                  <TouchableOpacity style={styles.timeBox}><Text style={styles.timeText}>{item.close}</Text></TouchableOpacity>
                </View>
              )}
            </View>
          ))}
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
  saveBtn: { padding: 8 },
  saveBtnText: { color: '#8B5CF6', fontWeight: '800' },
  scrollContent: { padding: 20 },
  infoCard: { backgroundColor: '#F5F3FF', padding: 16, borderRadius: 20, marginBottom: 24 },
  infoText: { fontSize: 13, color: '#8B5CF6', fontWeight: '600', lineHeight: 20 },
  list: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  dayRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontSize: 16, fontWeight: '700', color: '#111' },
  timeInputs: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  timeBox: { flex: 1, height: 44, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  timeText: { fontSize: 14, fontWeight: '700', color: '#111' },
  sep: { color: '#94A3B8', fontWeight: '600' }
});
