import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, ScrollView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function DataUsageScreen() {
  const navigation = useNavigation();
  const [saveData, setSaveData] = useState(false);
  const [highRes, setHighRes] = useState(true);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Usage</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Data Saver</Text>
              <Text style={styles.desc}>Reduce data usage by loading lower resolution images of products.</Text>
            </View>
            <Switch value={saveData} onValueChange={setSaveData} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>High Resolution over Wi-Fi</Text>
              <Text style={styles.desc}>Automatically load best quality assets when connected to Wi-Fi.</Text>
            </View>
            <Switch value={highRes} onValueChange={setHighRes} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
        </View>

        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Download My Data</Text>
          <Text style={styles.downloadSub}>Get a copy of your procurement history & activity.</Text>
        </TouchableOpacity>
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
  section: { backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  label: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  desc: { fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 },
  downloadBtn: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  downloadText: { fontSize: 16, fontWeight: '800', color: '#137FEC' },
  downloadSub: { fontSize: 13, color: '#64748B', marginTop: 4 }
});
