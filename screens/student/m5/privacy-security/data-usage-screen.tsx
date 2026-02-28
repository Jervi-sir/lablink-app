import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { paddingHorizontal } from "@/utils/variables/styles";

export default function DataUsageScreen() {
  const navigation = useNavigation();
  const [saveData, setSaveData] = useState(false);
  const [highRes, setHighRes] = useState(true);

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Data Usage</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Data Saver</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 }}>Reduce data usage by loading lower resolution images of products.</Text>
            </View>
            <Switch value={saveData} onValueChange={setSaveData} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>High Resolution over Wi-Fi</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 }}>Automatically load best quality assets when connected to Wi-Fi.</Text>
            </View>
            <Switch value={highRes} onValueChange={setHighRes} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
        </View>

        <TouchableOpacity style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#137FEC' }}>Download My Data</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Get a copy of your procurement history & activity.</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

