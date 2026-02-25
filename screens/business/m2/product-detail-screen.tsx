import React, { useState } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform, LayoutAnimation, UIManager } from "react-native";
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
          <View style={styles.contentBody}>
            <View style={styles.statsGrid}>
              <View style={styles.miniStat}>
                <Text style={styles.miniLabel}>Total Revenue</Text>
                <Text style={styles.miniValue}>180k DA</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={styles.miniLabel}>Page Views</Text>
                <Text style={styles.miniValue}>1,420</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={styles.miniLabel}>Sales Count</Text>
                <Text style={styles.miniValue}>4</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={styles.miniLabel}>Conversions</Text>
                <Text style={styles.miniValue}>2.8%</Text>
              </View>
            </View>
          </View>
        );
      case 'specs':
        return (
          <View style={styles.contentBody}>
            <View style={styles.specRow}><Text style={styles.specLabel}>Magnification</Text><Text style={styles.specValue}>40X - 1600X</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>LCD Screen</Text><Text style={styles.specValue}>7-inch IPS</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>SKU</Text><Text style={styles.specValue}>#NB-500-D</Text></View>
          </View>
        );
      case 'desc':
        return (
          <View style={styles.contentBody}>
            <Text style={styles.detailText}>
              Professional-grade digital microscope designed for high-precision biological research. High-density CMOS sensor captures 1080P video. 7-inch IPS display.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Detail</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product })}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Stage */}
        <View style={styles.imageStage}>
          <View style={styles.imageBox}>
            <Text style={styles.mainEmoji}>{product.image}</Text>
          </View>
          <View style={styles.imagePagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Vital Info */}
        <View style={styles.vitalInfo}>
          <View style={styles.rowBetween}>
            <Text style={styles.categoryTag}>{product.category}</Text>
            <View style={[styles.statusBadge, product.status === 'Active' ? styles.activeBadge : styles.oosBadge]}>
              <Text style={[styles.statusText, product.status === 'Active' ? styles.activeText : styles.oosText]}>{product.status}</Text>
            </View>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>{product.price}</Text>
            <Text style={styles.stockInfo}>{product.stock} units available</Text>
          </View>
        </View>

        {/* Management Sections */}
        <View style={styles.sectionsList}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[styles.accordionItem, isExpanded && styles.accordionItemExpanded]}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={styles.sectionMain}>
                    <View style={styles.iconContainer}>
                      <Text style={{ fontSize: 16 }}>{section.icon}</Text>
                    </View>
                    <Text style={styles.sectionLabel}>{section.title}</Text>
                  </View>
                  <View style={[styles.chevron, isExpanded && styles.chevronExpanded]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>

        {/* Global Performance Visibility (Always Visible) */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Views Over Time</Text>
          <View style={styles.chartContainer}>
            {[50, 70, 45, 90, 110, 80, 95].map((val, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBar, { height: val }]} />
                <Text style={styles.chartDay}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Business Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.promoteBtn}>
          <Text style={styles.promoteBtnText}>Promote Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.visibilityBtn}>
          <Text style={styles.visibilityBtnText}>Mark Private</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  editBtn: { backgroundColor: '#F5F3FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  editBtnText: { color: '#8B5CF6', fontWeight: '800', fontSize: 13 },
  scrollContent: { paddingBottom: 150 },
  imageStage: { padding: 20, alignItems: 'center' },
  imageBox: { width: width - 40, height: width - 40, backgroundColor: '#FFF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 3 },
  mainEmoji: { fontSize: 80 },
  imagePagination: { flexDirection: 'row', gap: 6, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  activeDot: { width: 20, backgroundColor: '#8B5CF6' },
  vitalInfo: { padding: 20, gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTag: { fontSize: 12, fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadge: { backgroundColor: '#F0FDF4' },
  oosBadge: { backgroundColor: '#FEF2F2' },
  statusText: { fontSize: 10, fontWeight: '800' },
  activeText: { color: '#16A34A' },
  oosText: { color: '#EF4444' },
  productName: { fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  priceValue: { fontSize: 28, fontWeight: '900', color: '#111' },
  stockInfo: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  sectionsList: { paddingHorizontal: 20, gap: 12, marginBottom: 32 },
  accordionItem: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  accordionItemExpanded: { borderColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  sectionMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#334155' },
  chevron: { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: '-45deg' }] },
  chevronExpanded: { transform: [{ rotate: '45deg' }], borderColor: '#8B5CF6' },
  contentBody: { padding: 16, paddingTop: 0, gap: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  miniStat: { width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 },
  miniLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  miniValue: { fontSize: 16, fontWeight: '800', color: '#111' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  specLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  specValue: { fontSize: 14, color: '#1E293B', fontWeight: '700' },
  detailText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' },
  chartSection: { paddingHorizontal: 20 },
  chartTitle: { fontSize: 15, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  chartContainer: { height: 160, backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F1F5F9' },
  chartCol: { alignItems: 'center', gap: 8 },
  chartBar: { width: 14, backgroundColor: '#8B5CF6', borderRadius: 100 },
  chartDay: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  promoteBtn: { flex: 2, backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  promoteBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  visibilityBtn: { flex: 1, backgroundColor: '#F1F5F9', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  visibilityBtnText: { color: '#475569', fontSize: 14, fontWeight: '700' }
});
