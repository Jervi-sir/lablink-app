import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function ServiceAgreementsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Agreements</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Terms of Partnership</Text>
          <Text style={styles.cardDate}>Last updated: Jan 01, 2024</Text>
          <View style={styles.divider} />
          <Text style={styles.legalText}>
            By listing your laboratory on LabLink, you agree to provide accurate technical data for all products.
            {"\n\n"}
            1. Fulfillment: Labs are expected to acknowledge procurement requests within 24 hours.
            {"\n\n"}
            2. Safety: All hazardous materials must have valid MSDS documentation attached.
            {"\n\n"}
            3. Payments: Payouts are processed every 14 days after successful delivery confirmation.
            {"\n\n"}
            4. Quality: Equipment must meet the technical specifications described in the listing.
          </Text>
        </View>

        <View style={styles.acceptanceBox}>
          <View style={styles.checkIcon}><Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text></View>
          <Text style={styles.acceptedText}>You have accepted the latest terms on Feb 24, 2024.</Text>
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
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  cardDate: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  legalText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' },
  acceptanceBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 16, borderRadius: 20, marginTop: 24, gap: 12, borderWidth: 1, borderColor: '#DCFCE7' },
  checkIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  acceptedText: { fontSize: 13, color: '#16A34A', fontWeight: '700', flex: 1 }
});
