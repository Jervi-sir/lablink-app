import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet, Dimensions, Image, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const LAB_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: `${i}`,
  name: i % 2 === 0 ? 'Digital LCD Microscope' : 'Borosil Glass Beakers',
  price: i % 2 === 0 ? '45,000 DA' : '1,200 DA',
  image: null,
}));

const CONTACTS = [
  { id: '1', type: 'Location', value: '123 Science Park, University Campus', icon: '📍' },
  { id: '2', type: 'Phone', value: '+213 550 123 456', icon: '📞' },
  { id: '3', type: 'Email', value: 'contact@bio-research.dz', icon: '✉️' },
  { id: '4', type: 'Website', value: 'www.bio-research.dz', icon: '🌐' },
];

export default function BusinessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { labName = "Advanced Bio-Research Lab" } = route.params || {};

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Bio & Intro Section */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.statusDot} />
          </View>
          <View style={styles.titleInfo}>
            <Text style={styles.labName}>{labName}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ VERIFIED</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ 4.9</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Rentals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Uptime</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Facility</Text>
        <Text style={styles.aboutText}>
          Established in 2018, our Advanced Bio-Research Laboratory provides cutting-edge genomics and biochemical analysis services.
        </Text>

        <View style={styles.licenseCard}>
          <View style={styles.licenseIcon}><Text style={{ fontSize: 24 }}>📜</Text></View>
          <View style={styles.licenseInfo}>
            <Text style={styles.licenseTitle}>Operating License #DZ-2024-99</Text>
            <Text style={styles.licenseSubtitle}>Ministry of Higher Education</Text>
          </View>
        </View>
      </View>

      {/* Specializations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expertise</Text>
        <View style={styles.expertiseWrap}>
          {['Genomics', 'Proteomics', 'Bio-Safety L3', 'HPLC Analysis'].map((item) => (
            <View key={item} style={styles.expertiseTag}>
              <Text style={styles.expertiseText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Connectivity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connectivity</Text>
        <View style={styles.contactsList}>
          {CONTACTS.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactIconBg}><Text style={{ fontSize: 16 }}>{contact.icon}</Text></View>
              <View style={styles.contactDetail}>
                <Text style={styles.contactType}>{contact.type}</Text>
                <Text style={styles.contactValue}>{contact.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Area */}
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Book Appointment</Text></TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Message</Text></TouchableOpacity>
      </View>

      {/* Products Header */}
      <View style={[styles.section, { marginBottom: 16 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Equipment</Text>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.LabProductsScreen, { labName })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: { ...item, lab: labName } })}
    >
      <View style={styles.productImagePlaceholder} />
      <View style={styles.productInfo}>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Top Floating Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{labName}</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={LAB_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => console.log('Load more products')}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FB',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContent: {
    padding: 20,
  },
  profileInfo: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  titleInfo: {
    flex: 1,
    gap: 4,
  },
  labName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#137FEC',
  },
  aboutText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 8,
  },
  licenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  licenseIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  licenseInfo: {
    flex: 1,
  },
  licenseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  licenseSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  expertiseWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  expertiseTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  expertiseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  contactsList: {
    marginTop: 12,
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactDetail: {
    flex: 1,
  },
  contactType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#137FEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  productImagePlaceholder: {
    height: COLUMN_WIDTH,
    backgroundColor: '#F8FAFC',
  },
  productInfo: {
    padding: 12,
    gap: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
  },
  productName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
