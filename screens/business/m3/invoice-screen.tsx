import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

export default function BusinessInvoiceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order = {
    id: 'ORD-8821',
    student: 'Amine Kerroum',
    items: 'Digital Microscope X1',
    amount: '45,000 DA',
    date: '24 Feb, 2024',
  } } = route.params || {};

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Document</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* The Invoice Paper */}
        <View style={styles.invoicePaper}>
          {/* Lab Branding */}
          <View style={styles.paperHeader}>
            <View>
              <Text style={styles.labName}>ADVANCED BIO-LABS</Text>
              <Text style={styles.labAddress}>Route du Cap, Algiers, Algeria</Text>
              <Text style={styles.labContact}>+213 550 123 456 | billing@biolabs.dz</Text>
            </View>
            <View style={styles.logoPlaceholder}>
              <Text style={{ fontSize: 24 }}>🧬</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Invoice Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>BILL TO:</Text>
              <Text style={styles.infoValue}>{order.student}</Text>
              <Text style={styles.infoSub}>Faculty of Biological Sciences</Text>
              <Text style={styles.infoSub}>USTHB University</Text>
            </View>
            <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
              <View style={{ gap: 4 }}>
                <Text style={styles.metaLine}><Text style={styles.bold}>Invoice #:</Text> INV-24-{(order.id || '8821')}</Text>
                <Text style={styles.metaLine}><Text style={styles.bold}>Date:</Text> {order.date}</Text>
                <Text style={styles.metaLine}><Text style={styles.bold}>Payment:</Text> Bank Transfer</Text>
              </View>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHead}>
            <Text style={[styles.colLabel, { flex: 2 }]}>ITEM DESCRIPTION</Text>
            <Text style={[styles.colLabel, { flex: 0.5, textAlign: 'center' }]}>QTY</Text>
            <Text style={[styles.colLabel, { flex: 1, textAlign: 'right' }]}>TOTAL</Text>
          </View>

          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.itemText, { flex: 2 }]}>{order.items}</Text>
            <Text style={[styles.itemText, { flex: 0.5, textAlign: 'center' }]}>1</Text>
            <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>{order.amount}</Text>
          </View>

          {/* Totals Section */}
          <View style={styles.totalsArea}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalVal}>{order.amount}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>VAT (19%)</Text>
              <Text style={styles.totalVal}>8,550 DA</Text>
            </View>
            <View style={[styles.totalLine, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.grandTotalVal}>53,550 DA</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.paperFooter}>
            <Text style={styles.footerText}>Thank you for your procurement. This is a computer-generated document and does not require a physical signature for digital validation.</Text>
          </View>
        </View>

        {/* Actions Outside Paper */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadBtnText}>Download Official PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.printBtn}>
          <Text style={styles.printBtnText}>Print Invoice</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#5D6575' }, // Dark professional background for "viewing a document" mode
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  shareBtn: { padding: 8 },
  shareBtnText: { color: '#8B5CF6', fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 60, alignItems: 'center' },
  invoicePaper: {
    width: width - 40,
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 32,
  },
  paperHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  labName: { fontSize: 20, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
  labAddress: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  labContact: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  logoPlaceholder: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1.5, backgroundColor: '#F1F5F9', marginVertical: 24 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', marginBottom: 8 },
  infoValue: { fontSize: 15, fontWeight: '900', color: '#111' },
  infoSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  metaLine: { fontSize: 13, color: '#64748B' },
  bold: { fontWeight: '700', color: '#111' },
  tableHead: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingVertical: 12, marginBottom: 12 },
  colLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  itemText: { fontSize: 14, fontWeight: '600', color: '#111' },
  totalsArea: { marginTop: 32, alignSelf: 'flex-end', width: '60%', gap: 10 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  totalVal: { fontSize: 14, color: '#111', fontWeight: '700' },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, marginTop: 4 },
  grandTotalLabel: { fontSize: 15, fontWeight: '900', color: '#111' },
  grandTotalVal: { fontSize: 18, fontWeight: '900', color: '#8B5CF6' },
  paperFooter: { marginTop: 60, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  footerText: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16, fontWeight: '500' },
  downloadBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  downloadBtnText: { fontSize: 16, fontWeight: '800', color: '#111' },
  printBtn: { width: '100%', height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  printBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
});
