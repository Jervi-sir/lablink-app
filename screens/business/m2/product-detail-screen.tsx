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
  { id: 'stats', title: 'Performance Stats', icon: '📊' },
  { id: 'specs', title: 'Specifications', icon: '⚙️' },
  { id: 'desc', title: 'Description', icon: 'ℹ️' },
];

export default function BusinessProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product = { name: 'Digital LCD Microscope', category: 'Optical Equipment', price: '45,000 DA', stock: 8, image: '🔬', status: 'Active' } } = route.params || {};

  const [expandedId, setExpandedId] = useState<string | null>('stats');

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'stats':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Total Revenue</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>180k DA</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Page Views</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>1,420</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Sales Count</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>4</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Conversions</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>2.8%</Text>
              </View>
            </View>
          </View>
        );
      case 'specs':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Magnification</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>40X - 1600X</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>LCD Screen</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>7-inch IPS</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}><Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>SKU</Text><Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>#NB-500-D</Text></View>
          </View>
        );
      case 'desc':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
              Professional-grade digital microscope designed for high-precision biological research. High-density CMOS sensor captures 1080P video. 7-inch IPS display.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Premium Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Inventory Detail</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product })}
        >
          <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 13 }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Product Image Stage */}
        <View style={{ padding: 20, alignItems: 'center' }}>
          <View style={{ width: width - 40, height: width - 40, backgroundColor: '#FFF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 3 }}>
            <Text style={{ fontSize: 80 }}>{product.image}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>
            <View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' }, { width: 20, backgroundColor: '#8B5CF6' }]} />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' }} />
          </View>
        </View>

        {/* Vital Info */}
        <View style={{ padding: 20, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase' }}>{product.category}</Text>
            <View style={[
              { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
              product.status === 'Active' ? { backgroundColor: '#F0FDF4' } : { backgroundColor: '#FEF2F2' }
            ]}>
              <Text style={[{ fontSize: 10, fontWeight: '800' }, product.status === 'Active' ? { color: '#16A34A' } : { color: '#EF4444' }]}>{product.status}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 }}>{product.name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{product.price}</Text>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{product.stock} units available</Text>
          </View>
        </View>

        {/* Management Sections */}
        <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 32 }}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[
                { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
                isExpanded && { borderColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }
              ]}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16 }}>{section.icon}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#334155' }}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: '-45deg' }] },
                    isExpanded && { transform: [{ rotate: '45deg' }], borderColor: '#8B5CF6' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>

        {/* Global Performance Visibility (Always Visible) */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Views Over Time</Text>
          <View style={{ height: 160, backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F1F5F9' }}>
            {[50, 70, 45, 90, 110, 80, 95].map((val, i) => (
              <View key={i} style={{ alignItems: 'center', gap: 8 }}>
                <View style={[{ width: 14, backgroundColor: '#8B5CF6', borderRadius: 100 }, { height: val }]} />
                <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '700' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Business Actions */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ flex: 2, backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Promote Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#F1F5F9', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#475569', fontSize: 14, fontWeight: '700' }}>Mark Private</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

