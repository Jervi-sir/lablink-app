import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const RECENT_ORDERS = [
  { id: '1', name: 'TechScience Labs', details: '2 Items • $1,240', status: 'PENDING', statusBg: '#FFFBE6', statusColor: '#D46B08' },
  { id: '2', name: 'BioUni Research', details: '5 Items • $450', status: 'PAID', statusBg: '#F6FFED', statusColor: '#389E0D' },
];

export default function StatsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* User Profil Bar */}
      <View style={styles.profileHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder} />
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>Dr. Sarah Smith</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <View style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Total Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueTop}>
            <View style={styles.revenueIconContainer}>
              <View style={styles.cashIcon} />
            </View>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.revenueLabel}>Total Revenue</Text>
          <Text style={styles.revenueValue}>$45,231</Text>
        </View>

        {/* Small Stats Cards */}
        <View style={styles.smallStatsRow}>
          <View style={styles.smallStatCard}>
            <View style={styles.statIconBox}>
              <View style={styles.invIcon} />
            </View>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.smallStatCard}>
            <View style={styles.statIconBox}>
              <View style={styles.cartIcon} />
            </View>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>New Orders</Text>
          </View>
        </View>

        {/* Sales Overview / Chart Mockup */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Sales Overview</Text>
              <Text style={styles.chartSub}>Last 7 Days</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartBody}>
            {/* Mock chart line graphic */}
            <View style={styles.chartGraphicContainer}>
              <View style={styles.chartLine} />
              <View style={styles.chartGradient} />
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.dayLabel}>MON</Text>
              <Text style={styles.dayLabel}>WED</Text>
              <Text style={styles.dayLabel}>FRI</Text>
              <Text style={styles.dayLabel}>SUN</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionCardPrimary}>
          <View style={styles.actionLeft}>
            <View style={styles.actionCircleWhite}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <View>
              <Text style={styles.actionTitleWhite}>Add New Product</Text>
              <Text style={styles.actionSubWhite}>Create listing for reagents</Text>
            </View>
          </View>
          <View style={styles.arrowIconWhite} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCardSecondary}>
          <View style={styles.actionLeft}>
            <View style={styles.actionCircleGrey}>
              <View style={styles.boxIcon} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Manage Inventory</Text>
              <Text style={styles.actionSub}>Update stock levels</Text>
            </View>
          </View>
          <View style={styles.arrowIconGrey} />
        </TouchableOpacity>

        {/* Recent Orders List */}
        <View style={styles.recentOrdersHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderList}>
          {RECENT_ORDERS.map((order) => (
            <View key={order.id} style={styles.orderListItem}>
              <View style={styles.orderAvatar}>
                <Text style={styles.avatarInitial}>{order.name.substring(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.orderMid}>
                <Text style={styles.orderName}>{order.name}</Text>
                <Text style={styles.orderDetail}>{order.details}</Text>
              </View>
              <View style={[styles.orderStatusBadge, { backgroundColor: order.statusBg }]}>
                <Text style={[styles.orderStatusText, { color: order.statusColor }]}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: '#D9D9D9',
    borderRadius: 18,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111',
  },
  userName: {
    fontSize: 10,
    color: '#5D6575',
    fontWeight: '500',
  },
  notificationBtn: {
    padding: 8,
  },
  bellIcon: {
    width: 18,
    height: 20,
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 2,
  },
  container: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  revenueCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  revenueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  revenueIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E7F2FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashIcon: {
    width: 24,
    height: 16,
    borderWidth: 2,
    borderColor: '#137FEC',
    borderRadius: 2,
  },
  trendBadge: {
    backgroundColor: '#E9F7EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  trendText: {
    color: '#27AE60',
    fontSize: 12,
    fontWeight: '700',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#5D6575',
    fontWeight: '600',
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
  },
  smallStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  invIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#6B7280',
    borderRadius: 2,
  },
  cartIcon: {
    width: 16,
    height: 16,
    borderColor: '#137FEC',
    borderWidth: 2,
    borderBottomLeftRadius: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#5D6575',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  chartSub: {
    fontSize: 12,
    color: '#5D6575',
    fontWeight: '500',
  },
  seeAllBtn: {
    backgroundColor: '#E7F2FD',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  seeAllText: {
    color: '#137FEC',
    fontSize: 12,
    fontWeight: '700',
  },
  chartBody: {
    height: 180,
    gap: 8,
  },
  chartGraphicContainer: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chartLine: {
    height: 3,
    backgroundColor: '#137FEC',
    width: '100%',
    borderRadius: 2,
    transform: [{ rotate: '-10deg' }],
  },
  chartGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    backgroundColor: 'rgba(19, 127, 236, 0.05)',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  actionCardPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E70E8',
    padding: 18,
    borderRadius: 16,
  },
  actionCardSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionCircleWhite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
  },
  actionTitleWhite: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  actionSubWhite: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  actionCircleGrey: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxIcon: {
    width: 18,
    height: 14,
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  actionSub: {
    fontSize: 12,
    color: '#5D6575',
  },
  arrowIconWhite: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFF',
    transform: [{ rotate: '45deg' }],
  },
  arrowIconGrey: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#9CA3AF',
    transform: [{ rotate: '45deg' }],
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    color: '#137FEC',
    fontWeight: '700',
  },
  orderList: {
    gap: 12,
  },
  orderListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  orderAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  orderMid: {
    flex: 1,
    gap: 2,
  },
  orderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  orderDetail: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
});