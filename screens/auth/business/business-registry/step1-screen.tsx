import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, ActivityIndicator, TextInput } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBusinessRegistry } from "./context/business-registry-context";
import { useEffect, useRef, useState } from "react";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { SheetManager } from "react-native-actions-sheet";
import TouchableOpacity from "@/components/touchable-opacity";
import { Wilaya } from "@/utils/types";

export default function Step1Screen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { formData, setField } = useBusinessRegistry();
  const [labCategories, setLabCategories] = useState<any[]>([]);
  const [businessCategories, setBusinessCategories] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const addressInputRef = useRef<TextInput>(null);

  const focusAddressInput = () => {
    setTimeout(() => {
      addressInputRef.current?.focus();
    }, 250);
  };

  const openWilayaSheetAfterSelect = () => {
    setTimeout(() => {
      handleOpenWilayaSheet(true);
    }, 250);
  };

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

      // Auto-select business category based on route param
      const businessType = route.params?.type;
      if (businessType) {
        setField('businessCategory', businessType);
      }
    } catch (error) {
      console.error("Fetch taxonomies error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLabSheet = (goToNext = false) => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Laboratory Type",
        items: labCategories,
        selectedId: formData.laboratoryCategoryId,
        onSelect: (item) => {
          setField('laboratoryCategoryId', item.id);
          setField('type', item.code);

          if (goToNext) {
            openWilayaSheetAfterSelect();
          }
        }
      }
    });
  };

  const handleOpenWilayaSheet = (goToNext = false) => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Wilaya",
        items: wilayas,
        selectedId: formData.wilayaId,
        onSelect: (item) => {
          setField('wilayaId', item.id);

          if (goToNext) {
            focusAddressInput();
          }
        }
      }
    });
  };

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
                onSubmitEditing={() => handleOpenLabSheet(true)}
                returnKeyType="next"
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
                ref={addressInputRef}
                label="Physical Address"
                placeholder="Enter laboratory full address"
                value={formData.address}
                onChangeText={(v) => setField('address', v)}
                returnKeyType="done"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />

            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Button1
              text="Continue"
              onPress={() => navigation.navigate("BusinessStep2")}
              style={{ height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
              disabled={
                !formData.name
                || !formData.laboratoryCategoryId
                || !formData.businessCategory
                || !formData.wilayaId
                || !formData.address
              }
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
