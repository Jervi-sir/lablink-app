import { View, ScrollView } from "react-native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

export default function AuthSelectorScreen() {
  const navigation = useNavigation<any>();
  const [selectedRole, setSelectedRole] = useState<'student' | 'business' | null>(null);

  const accountTypes = [
    {
      id: 'student',
      title: "Student / Researcher",
      description: "Find verified labs, book specialized equipment, and source materials for your research projects.",
      iconColor: '#137FEC',
      iconBg: '#E7F2FD',
    },
    {
      id: 'business',
      title: "Laboratory / Supplier",
      description: "List your facility services, manage equipment bookings, and connect with top academic talent.",
      iconColor: '#8B5CF6',
      iconBg: '#F5F3FF',
    }
  ];

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentRegisterScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate('business-registry');
    }
  };

  const handleLogin = () => {
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentLoginScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate(Routes.BusinessLoginScreen);
    } else {
      // If no role selected, maybe prompt or just do nothing
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 16 }} onPress={() => navigation.goBack()}>
          <View style={{ width: 12, height: 12 }} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <View style={{ marginTop: 10, marginBottom: 32 }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#000', marginBottom: 8 }}>Welcome to LabLink</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', lineHeight: 20 }}>
              Choose your account type to get started with a personalized experience.
            </Text>
          </View>

          {/* Cards */}
          <View style={{ gap: 16 }}>
            {accountTypes.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedRole(item.id as any)}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#FFF',
                  padding: 20,
                  borderRadius: 16,
                  gap: 16,
                  borderWidth: 2,
                  borderColor: selectedRole === item.id ? (item.id === 'business' ? '#8B5CF6' : '#137FEC') : 'transparent',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <View style={{ width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: item.iconBg }}>
                  {/* Mock Icon Graphic */}
                  <View style={{ width: 20, height: 16, borderRadius: 2, backgroundColor: item.iconColor }} />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>{item.title}</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18, fontWeight: '500' }}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={{ padding: 20, gap: 16, paddingBottom: 40 }}>
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              backgroundColor: selectedRole === 'business' ? '#8B5CF6' : '#1E70E8',
              height: 54,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: !selectedRole ? 0.6 : 1
            }}
            disabled={!selectedRole}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={handleLogin}
          >
            <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '600' }}>
              Already have an account? <Text style={selectedRole === 'business' ? { color: '#8B5CF6' } : { color: '#137FEC' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}