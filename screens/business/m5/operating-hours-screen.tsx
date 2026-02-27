import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";

const DEFAULT_HOURS = [
  { day: 'Monday', enabled: true, open: '08:00', close: '17:00' },
  { day: 'Tuesday', enabled: true, open: '08:00', close: '17:00' },
  { day: 'Wednesday', enabled: true, open: '08:00', close: '17:00' },
  { day: 'Thursday', enabled: true, open: '08:00', close: '17:00' },
  { day: 'Friday', enabled: false, open: '08:00', close: '12:00' },
  { day: 'Saturday', enabled: false, open: 'Closed', close: 'Closed' },
  { day: 'Sunday', enabled: false, open: 'Closed', close: 'Closed' },
];

export default function OperatingHoursScreen() {
  const navigation = useNavigation<any>();
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [hours, setHours] = useState([...DEFAULT_HOURS]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchHours = useCallback(async () => {
    setIsLoading(true);
    try {
      const profileRes: any = await api.get(ApiRoutes.auth.business.me);
      const bProfile = profileRes.user?.businessProfile;
      setBusinessProfile(bProfile);

      if (bProfile?.operatingHours && Array.isArray(bProfile.operatingHours) && bProfile.operatingHours.length > 0) {
        setHours(bProfile.operatingHours);
      }
    } catch (error) {
      console.error("Error fetching operating hours:", error);
      Alert.alert("Error", "Could not fetch operating hours.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHours();
  }, [fetchHours]);

  const handleSave = async () => {
    if (!businessProfile?.id) return;

    setIsSaving(true);
    try {
      await api.put(`businesses/${businessProfile.id}`, {
        operating_hours: hours
      });
      Alert.alert("Success", "Operating hours updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving operating hours:", error);
      Alert.alert("Error", "Could not save operating hours.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Operating Hours</Text>
        <TouchableOpacity style={{ padding: 8 }} onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : (
            <Text style={{ color: '#8B5CF6', fontWeight: '800' }}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#F5F3FF', padding: 16, borderRadius: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, color: '#8B5CF6', fontWeight: '600', lineHeight: 20 }}>Set your lab's weekly schedule. This affects when orders can be processed and when customers see you as 'Open'.</Text>
        </View>

        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
          {hours.map((item, idx) => (
            <View key={item.day} style={[{ padding: 16 }, idx < hours.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{item.day}</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 }}>
                  <TouchableOpacity style={{ flex: 1, height: 44, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{item.open || '08:00'}</Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#94A3B8', fontWeight: '600' }}>to</Text>
                  <TouchableOpacity style={{ flex: 1, height: 44, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{item.close || '17:00'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

