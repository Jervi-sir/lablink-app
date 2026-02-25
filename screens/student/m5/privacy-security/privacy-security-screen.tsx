import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

import { Routes } from "@/utils/helpers/routes";

export default function PrivacySecurityScreen() {
  const navigation = useNavigation<any>();

  const renderSection = (title: string, items: { label: string, route?: string }[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.item, index === items.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => item.route && navigation.navigate(item.route)}
          >
            <Text style={styles.itemText}>{item.label}</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderSection("Security", [
          { label: "Change Password", route: Routes.ChangePasswordScreen },
          { label: "Two-Factor Authentication", route: Routes.TwoFactorAuthScreen },
          { label: "Login Activity", route: Routes.LoginActivityScreen }
        ])}
        {renderSection("Privacy", [
          { label: "Profile Visibility", route: Routes.ProfileVisibilityScreen },
          { label: "Data Usage", route: Routes.DataUsageScreen },
          { label: "Blocked Users" }
        ])}
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
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  itemText: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  chevron: { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }
});
