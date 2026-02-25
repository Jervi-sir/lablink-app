import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

import { Routes } from "@/utils/helpers/routes";

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(Routes.FAQScreen)}>
            <Text style={styles.itemText}>Frequently Asked Questions</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(Routes.ContactSupportScreen)}>
            <Text style={styles.itemText}>Contact Support</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(Routes.TermsOfServiceScreen)}>
            <Text style={styles.itemText}>Terms of Service</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
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
  card: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  itemText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  chevron: { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }
});
