import React, { useState } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, StatusBar, Platform, LayoutAnimation, UIManager } from "react-native";
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
          <View style={styles.contentBody}>
            <View style={styles.specRow}><Text style={styles.specLabel}>Magnification</Text><Text style={styles.specValue}>40X - 1600X</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>LCD Screen</Text><Text style={styles.specValue}>7-inch IPS</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Sensor</Text><Text style={styles.specValue}>12MP CMOS</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Output</Text><Text style={styles.specValue}>HDMI / USB 2.0</Text></View>
          </View>
        );
      case '2':
        return (
          <View style={styles.contentBody}>
            <Text style={styles.detailText}>
              This professional-grade digital microscope is designed for high-precision biological research. It features a high-density CMOS sensor that captures 1080P video and 12MP stills directly to a MicroSD card. The integrated 7-inch LCD eliminates eye strain from traditional eyepieces.
            </Text>
          </View>
        );
      case '3':
        return (
          <View style={styles.contentBody}>
            <View style={styles.msdsItem}>
              <View style={styles.msdsIcon} />
              <View>
                <Text style={styles.msdsTitle}>Electrical Safety Cert</Text>
                <Text style={styles.msdsSub}>PDF • 1.2 MB</Text>
              </View>
            </View>
            <View style={styles.msdsItem}>
              <View style={styles.msdsIcon} />
              <View>
                <Text style={styles.msdsTitle}>Handling Guide</Text>
                <Text style={styles.msdsSub}>PDF • 0.8 MB</Text>
              </View>
            </View>
          </View>
        );
      case '4':
        return (
          <View style={styles.contentBody}>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Dr. Amine K.</Text>
                <Text style={styles.reviewRating}>★★★★★</Text>
              </View>
              <Text style={styles.reviewText}>Exceptional clarity for the price. The HDMI output is perfect for university lectures.</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.rightNav}>
          <TouchableOpacity style={styles.iconBtn}>
            <View style={styles.heartIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <View style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Card */}
        <View style={styles.imageCard}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.headerInfo}>
          <View style={styles.categoryRow}>
            <Text style={styles.labName}>{product.lab}</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>IN STOCK</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.skuText}>SKU: #WB-500-DIG</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.vatText}>+ VAT applicable</Text>
          </View>
        </View>

        {/* Quick Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Quick Summary</Text>
          <Text style={styles.summaryText}>
            High-performance digital microscope with 7-inch LCD screen. Ideal for biological research and micro-analysis. Includes 1080P video capability.
          </Text>
        </View>

        {/* Accordion Sections */}
        <View style={styles.sectionsList}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[styles.accordionItem, isExpanded && styles.accordionItemExpanded]}>
                <TouchableOpacity
                  style={styles.sectionRow}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={styles.sectionMain}>
                    <View style={styles.sectionIconBg}>
                      <View style={[styles.mockIcon, isExpanded && { backgroundColor: '#137FEC' }]} />
                    </View>
                    <Text style={[styles.sectionLabel, isExpanded && { color: '#111' }]}>{section.title}</Text>
                  </View>
                  <View style={[styles.chevron, isExpanded && styles.chevronExpanded]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Routes.CheckoutScreen, { product, quantity })}
        >
          <Text style={styles.addToCartText}>Request Proposal</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FB',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    zIndex: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rightNav: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageCard: {
    width: width - 32,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#137FEC',
  },
  headerInfo: {
    padding: 24,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#137FEC',
    letterSpacing: 0.5,
  },
  stockBadge: {
    backgroundColor: '#E9F7EF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#27AE60',
  },
  productName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    lineHeight: 32,
  },
  skuText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  priceContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
  },
  vatText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  summarySection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  summaryText: {
    fontSize: 15,
    color: '#5D6575',
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#CBD5E1',
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#94A3B8',
    transform: [{ rotate: '-45deg' }],
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 40,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    width: 30,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#137FEC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  heartIcon: {
    width: 20,
    height: 18,
    borderWidth: 2,
    borderColor: '#111',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  shareIcon: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 2,
  },
  // Accordion Content Styles
  accordionItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 12,
  },
  accordionItemExpanded: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contentBody: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  specLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },
  msdsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  msdsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  msdsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  msdsSub: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  reviewItem: {
    gap: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  reviewRating: {
    fontSize: 12,
    color: '#F59E0B',
  },
  reviewText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
  },
  chevronExpanded: {
    transform: [{ rotate: '45deg' }],
    borderColor: '#137FEC',
  }
});