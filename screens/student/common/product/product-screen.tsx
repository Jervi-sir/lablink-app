import React, { useState } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, LayoutAnimation, UIManager } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const SECTIONS = [
  { id: '1', title: 'Specifications', icon: 'specs' },
  { id: '2', title: 'Description', icon: 'desc' },
  { id: '3', title: 'Safety Data (MSDS)', icon: 'msds' },
  { id: '4', title: 'Reviews', icon: 'reviews' },
];

export default function ProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product = { name: 'Digital LCD Microscope', lab: 'NanoTech', price: '45,000 DA' } } = route.params || {};

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const renderSectionContent = (id: string) => {
    switch (id) {
      case '1':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Magnification</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>40X - 1600X</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>LCD Screen</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>7-inch IPS</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Sensor</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>12MP CMOS</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Output</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>HDMI / USB 2.0</Text></View>
          </View>
        );
      case '2':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
              This professional-grade digital microscope is designed for high-precision biological research. It features a high-density CMOS sensor that captures 1080P video and 12MP stills directly to a MicroSD card. The integrated 7-inch LCD eliminates eye strain from traditional eyepieces.
            </Text>
          </View>
        );
      case '3':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E2E8F0' }} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Electrical Safety Cert</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>PDF • 1.2 MB</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E2E8F0' }} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Handling Guide</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>PDF • 0.8 MB</Text>
              </View>
            </View>
          </View>
        );
      case '4':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ gap: 8, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Dr. Amine K.</Text>
                <Text style={{ fontSize: 12, color: '#F59E0B' }}>★★★★★</Text>
              </View>
              <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18, fontWeight: '500' }}>Exceptional clarity for the price. The HDMI output is perfect for university lectures.</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      {/* Top Navigation */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56, zIndex: 20 }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
            <View style={{ width: 20, height: 18, borderWidth: 2, borderColor: '#111', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
            <View style={{ width: 18, height: 18, borderWidth: 2, borderColor: '#111', borderRadius: 2 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Image Card */}
        <View style={{ width: width - 32, aspectRatio: 1, backgroundColor: '#FFF', borderRadius: 24, marginHorizontal: 16, marginTop: 8, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 }}>
          <View style={{ flex: 1, backgroundColor: '#F3F4F6' }} />
          <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
            <View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' }, { width: 24, backgroundColor: '#137FEC' }]} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' }} />
          </View>
        </View>

        {/* Info Section */}
        <View style={{ padding: 24, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC', letterSpacing: 0.5 }}>{product.lab}</Text>
            <View style={{ backgroundColor: '#E9F7EF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#27AE60' }}>IN STOCK</Text>
            </View>
          </View>

          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 }}>{product.name}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>SKU: #WB-500-DIG</Text>

          <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{product.price}</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>+ VAT applicable</Text>
          </View>
        </View>

        {/* Quick Summary */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Quick Summary</Text>
          <Text style={{ fontSize: 15, color: '#5D6575', lineHeight: 22, fontWeight: '500' }}>
            High-performance digital microscope with 7-inch LCD screen. Ideal for biological research and micro-analysis. Includes 1080P video capability.
          </Text>
        </View>

        {/* Accordion Sections */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[
                { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 12 },
                isExpanded && { borderColor: '#E2E8F0', backgroundColor: '#FFF', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }
              ]}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={[{ width: 18, height: 18, backgroundColor: '#CBD5E1', borderRadius: 4 }, isExpanded && { backgroundColor: '#137FEC' }]} />
                    </View>
                    <Text style={[{ fontSize: 16, fontWeight: '700', color: '#334155' }, isExpanded && { color: '#111' }]}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: '-45deg' }] },
                    isExpanded && { transform: [{ rotate: '45deg' }], borderColor: '#137FEC' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, gap: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 4 }}>
          <TouchableOpacity style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={decrementQty}><Text style={{ fontSize: 20, fontWeight: '600', color: '#111' }}>-</Text></TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', width: 30, textAlign: 'center' }}>{quantity}</Text>
          <TouchableOpacity style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={incrementQty}><Text style={{ fontSize: 20, fontWeight: '600', color: '#111' }}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#137FEC', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.CheckoutScreen, { product, quantity })}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>Request Proposal</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}