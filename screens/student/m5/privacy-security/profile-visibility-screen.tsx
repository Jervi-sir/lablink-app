import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function ProfileVisibilityScreen() {
  const navigation = useNavigation();
  const [isPublic, setIsPublic] = useState(true);
  const [showResearch, setShowResearch] = useState(true);
  const [showDepartment, setShowDepartment] = useState(true);

  const renderToggle = (label: string, desc: string, value: boolean, onValueChange: (v: boolean) => void) => (
    <View style={styles.settingRow}>
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
      />
    </View>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Visibility</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          {renderToggle(
            "Public Profile",
            "Allow laboratories and other students to see your profile details.",
            isPublic,
            setIsPublic
          )}
          {renderToggle(
            "Show Research Area",
            "Display your specialized department and research interest.",
            showResearch,
            setShowResearch
          )}
          {renderToggle(
            "Show Department",
            "Make your university department visible on your profile card.",
            showDepartment,
            setShowDepartment
          )}
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
  section: { backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  settingLabel: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  settingDesc: { fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 }
});
