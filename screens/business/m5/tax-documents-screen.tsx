import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function TaxDocumentsScreen() {
  const navigation = useNavigation<any>();

  const DOCS = [
    { name: 'Income Statement Q4 2023', date: 'Jan 15, 2024', size: '2.4 MB' },
    { name: 'VAT Report - Dec 2023', date: 'Jan 05, 2024', size: '1.1 MB' },
    { name: 'Annual Tax Summary 2023', date: 'Dec 31, 2023', size: '4.8 MB' },
  ];

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tax Documents</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Download your laboratory's financial reports and tax documents for your accounting records.</Text>
        </View>

        <View style={styles.list}>
          {DOCS.map((doc, idx) => (
            <View key={idx} style={styles.docRow}>
              <View style={[styles.docRow, { borderBottomWidth: 0, padding: 0 }]}>
                <View style={styles.iconBox}><Text style={{ fontSize: 20 }}>📄</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docMeta}>{doc.date} • {doc.size}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadBtnText}>Download</Text>
              </TouchableOpacity>
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
  scrollContent: { padding: 20 },
  infoCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  infoText: { fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' },
  list: { gap: 12 },
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', gap: 14 },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 15, fontWeight: '700', color: '#111' },
  docMeta: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  downloadBtn: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  downloadBtnText: { color: '#8B5CF6', fontSize: 13, fontWeight: '800' }
});
