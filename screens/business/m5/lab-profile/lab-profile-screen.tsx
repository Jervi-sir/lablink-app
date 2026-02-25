import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Image } from "react-native";

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48 - 12) / 2;

const SPECIALIZATIONS = ['Organic Chemistry', 'Bioengineering', 'Genomics', 'PCR Analysis'];
const TABS = ['Products', 'Reviews', 'Certifications'];

const PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '2', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '3', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
  { id: '4', name: 'Digital LCD Microscope', price: '4000 DA/day', tag: 'Rent' },
];

export default function LabProfileScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.rightNav}>
          <TouchableOpacity style={styles.navBtn}>
            <View style={styles.heartIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <View style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Lab Header */}
        <View style={styles.labHeader}>
          <View style={styles.labLogoPlaceholder} />
          <View>
            <Text style={styles.labName}>BioGen Laboratory</Text>
            <Text style={styles.labLocation}>Location</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainerBlue}>
              <View style={styles.boltIcon} />
            </View>
            <View>
              <Text style={styles.statLabel}>Response Time</Text>
              <Text style={styles.statValue}>&lt; 2hours</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainerGold}>
              <View style={styles.starIcon} />
            </View>
            <View>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>4.7 (124)</Text>
            </View>
          </View>
        </View>

        {/* About Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About us</Text>
          <Text style={styles.sectionText}>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
          </Text>
        </View>

        {/* Specialization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <View style={styles.chipRow}>
            {SPECIALIZATIONS.map((spec) => (
              <View key={spec} style={styles.chip}>
                <Text style={styles.chipText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab, index) => (
            <TouchableOpacity key={tab} style={[styles.tab, index === 0 && styles.activeTab]}>
              <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {PRODUCTS.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <View style={styles.productImagePlaceholder} />
                <View style={styles.rentTag}>
                  <Text style={styles.rentTagText}>{item.tag}</Text>
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                  <View style={styles.heartMiniIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.labNameSmall}>Labo name</Text>
                <Text style={styles.productTitle}>{item.name}</Text>
                <View style={styles.productBottom}>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Contact Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactBtn}>
          <View style={styles.phoneIcon} />
          <Text style={styles.contactBtnText}>Contact Lab</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  rightNav: {
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#111',
    transform: [{ rotate: '-45deg' }],
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
  scrollContent: {
    paddingBottom: 100,
  },
  labHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  labLogoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
  },
  labName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  labLocation: {
    fontSize: 16,
    color: '#5D6575',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainerBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconContainerGold: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boltIcon: {
    width: 10,
    height: 16,
    backgroundColor: '#137FEC',
  },
  starIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#F59E0B',
  },
  statLabel: {
    fontSize: 10,
    color: '#5D6575',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  sectionText: {
    fontSize: 14,
    color: '#5D6575',
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#137FEC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#137FEC',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1A2526',
  },
  productImagePlaceholder: {
    flex: 1,
  },
  rentTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rentTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartMiniIcon: {
    width: 14,
    height: 12,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  productInfo: {
    padding: 12,
    gap: 4,
  },
  labNameSmall: {
    fontSize: 10,
    color: '#5D6575',
    fontWeight: '500',
  },
  productTitle: {
    fontSize: 14,
    color: '#111',
    fontWeight: '700',
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#137FEC',
    fontWeight: '800',
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E7F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#137FEC',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  contactBtn: {
    flexDirection: 'row',
    backgroundColor: '#137FEC',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  contactBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  phoneIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
});
