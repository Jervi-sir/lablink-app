import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { useBusinessRegistry } from "./context/business-registry-context";
import { useEffect, useState } from "react";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { SheetManager } from "react-native-actions-sheet";
import TouchableOpacity from "@/components/touchable-opacity";
import { Wilaya } from "@/utils/types";

export default function Step1Screen() {
  const navigation = useNavigation<any>();
  const { formData, setField } = useBusinessRegistry();
  const [labCategories, setLabCategories] = useState<any[]>([]);
  const [businessCategories, setBusinessCategories] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  const fetchTaxonomies = async () => {
    try {
      setLoading(true);
      const response = await apiPublic.get(buildRoute(ApiRoutes.taxonomies), {
        params: { types: 'laboratory_categories,business_categories,wilayas' }
      });
      setLabCategories(response.laboratory_categories || []);
      setBusinessCategories(response.business_categories || []);
      setWilayas(response.wilayas || []);
    } catch (error) {
      console.error("Fetch taxonomies error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLabSheet = () => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Laboratory Type",
        items: labCategories,
        selectedId: formData.laboratoryCategoryId,
        onSelect: (item) => {
          setField('laboratoryCategoryId', item.id);
          setField('type', item.code);
        }
      }
    });
  };

  const handleOpenBusinessSheet = () => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Business Category",
        items: businessCategories,
        selectedId: formData.businessCategoryId,
        onSelect: (item) => {
          setField('businessCategoryId', item.id);
        }
      }
    });
  };

  const handleOpenWilayaSheet = () => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Wilaya",
        items: wilayas,
        selectedId: formData.wilayaId,
        onSelect: (item) => {
          setField('wilayaId', item.id);
        }
      }
    });
  };

  const selectedBusinessCategory = businessCategories.find(c => c.id === formData.businessCategoryId)?.code || '';
  const selectedWilayaData = wilayas.find(w => w.id === formData.wilayaId);
  const selectedWilaya = selectedWilayaData ? (selectedWilayaData.code ? `${selectedWilayaData.number} - ${selectedWilayaData.code}` : selectedWilayaData.code) : '';

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Lab Profile'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={1} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Tell us about your Lab</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Join our network of verified research facilities and connect with researchers.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Basic Information</Text>
            </View>

            <View style={{ gap: 16 }}>
              <GlobalInput
                label="Legal Laboratory Name"
                placeholder="e.g. Advanced Bio-Research Lab"
                value={formData.name}
                onChangeText={(v) => setField('name', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />

              <TouchableOpacity onPress={handleOpenLabSheet} activeOpacity={0.7}>
                <View pointerEvents="none">
                  <GlobalInput
                    label="Laboratory Type"
                    placeholder="Select laboratory type"
                    value={formData.type}
                    containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                    right={
                      loading ? (
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      ) : (
                        <View style={{ width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#6B7280', transform: [{ rotate: '45deg' }], marginBottom: 4 }} />
                      )
                    }
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleOpenBusinessSheet} activeOpacity={0.7}>
                <View pointerEvents="none">
                  <GlobalInput
                    label="Business Category"
                    placeholder="Select business category"
                    value={selectedBusinessCategory}
                    containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                    right={
                      loading ? (
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      ) : (
                        <View style={{ width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#6B7280', transform: [{ rotate: '45deg' }], marginBottom: 4 }} />
                      )
                    }
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleOpenWilayaSheet} activeOpacity={0.7}>
                <View pointerEvents="none">
                  <GlobalInput
                    label="Wilaya"
                    placeholder="Select wilaya"
                    value={selectedWilaya}
                    containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                    right={
                      loading ? (
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      ) : (
                        <View style={{ width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#6B7280', transform: [{ rotate: '45deg' }], marginBottom: 4 }} />
                      )
                    }
                  />
                </View>
              </TouchableOpacity>

              <GlobalInput
                label="Physical Address"
                placeholder="Enter laboratory full address"
                value={formData.address}
                onChangeText={(v) => setField('address', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />

              <GlobalInput
                label="Contact Person Name"
                placeholder="Enter full name"
                value={formData.contactName}
                onChangeText={(v) => setField('contactName', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Business Email"
                placeholder="contact@labname.com"
                value={formData.email}
                onChangeText={(v) => setField('email', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <GlobalInput
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(v) => setField('password', v)}
                kind="password"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Button1
              text="Continue"
              onPress={() => navigation.navigate("BusinessStep2")}
              style={{ height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
              disabled={!formData.name || !formData.email || !formData.password || !formData.laboratoryCategoryId || !formData.businessCategoryId || !formData.wilayaId || !formData.address}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}