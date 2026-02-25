import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function ProfileVisibilityScreen() {
  const navigation = useNavigation();
  const [isPublic, setIsPublic] = useState(true);
  const [showResearch, setShowResearch] = useState(true);
  const [showDepartment, setShowDepartment] = useState(true);

  const renderToggle = (label: string, desc: string, value: boolean, onValueChange: (v: boolean) => void) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{label}</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 }}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
      />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Profile Visibility</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
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

