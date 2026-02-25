import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

const SPECIALIZATIONS = ['Organic Chemistry', 'Bioengineering', 'Genomics', 'PCR Analysis'];

export default function Step3Screen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Public Profile'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={3} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Public Presence</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Add a logo and description to help students identify your laboratory facility.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Laboratory Branding</Text>
            </View>

            {/* Avatar Upload */}
            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 32, gap: 12 }} activeOpacity={0.8}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, borderRadius: 19, backgroundColor: '#8B5CF6', borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                  {/* Mock Camera Icon */}
                  <View style={{ width: 16, height: 10, borderWidth: 2, borderColor: '#FFF', borderRadius: 2 }} />
                </View>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#8B5CF6' }}>Upload Laboratory Logo</Text>
            </TouchableOpacity>

            <View style={{ gap: 20 }}>
              <GlobalInput
                label="About the Lab"
                placeholder="Briefly describe your services and expertise..."
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                multiline
                numberOfLines={4}
                kind="multiline"
              />

              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 8 }}>Specialization Area</Text>
                <GlobalInput
                  placeholder="Add a specialization..."
                  containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                  right={<View style={{ width: 20, height: 20, backgroundColor: '#8B5CF6', borderRadius: 10 }} />}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {SPECIALIZATIONS.map((tag) => (
                    <View key={tag} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F5F3FF', borderRadius: 100, gap: 6 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#8B5CF6' }}>{tag}</Text>
                      <View style={{ width: 14, height: 14, backgroundColor: '#8B5CF6', borderRadius: 7, opacity: 0.3 }} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 32 }}>
            <Button1
              text="Complete Registration"
              onPress={() => navigation.navigate(Routes.BusinessNavigation)}
              style={{ height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}