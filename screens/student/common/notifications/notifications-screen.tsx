import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const FILTER_TABS = ['All', 'Orders', 'Messages', 'System'];

const NOTIFICATIONS = [
  {
    section: 'TODAY',
    data: [
      {
        id: '1',
        title: 'Order #123 Shipped',
        message: 'Your glassware kit is on the way. Track your package to see arrival...',
        time: '10m ago',
        type: 'order',
        unread: true,
        iconBg: '#E7F2FD',
        iconColor: '#137FEC'
      },
      {
        id: '2',
        title: 'Lab XYZ Replied',
        message: 'Professor Smith: Please confirm the quantity for the titration...',
        time: '1h ago',
        type: 'message',
        unread: true,
        iconBg: '#F5F3FF',
        iconColor: '#8B5CF6'
      }
    ]
  },
  {
    section: 'YESTERDAY',
    data: [
      {
        id: '3',
        title: 'New Kit Available',
        message: 'Organic Chemistry Set B is now in stock for the upcoming semester.',
        time: '1d ago',
        type: 'system',
        unread: false,
        iconBg: '#E9F7EF',
        iconColor: '#27AE60'
      },
      {
        id: '4',
        title: 'Account Verified',
        message: 'Your student verification was successful. You can now access...',
        time: '2d ago',
        type: 'system',
        unread: false,
        iconBg: '#FFFBEB',
        iconColor: '#F59E0B'
      },
      {
        id: '5',
        title: 'Order #118 Delivered',
        message: 'Package was left at the front desk.',
        time: '5d ago',
        type: 'order',
        unread: false,
        iconBg: '#F3F4F6',
        iconColor: '#6B7280'
      }
    ]
  }
];

export default function NotificationsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map((tab, index) => (
            <TouchableOpacity key={tab} style={[styles.filterTab, index === 0 && styles.activeFilterTab]}>
              <Text style={[styles.filterTabText, index === 0 && styles.activeFilterTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {NOTIFICATIONS.map((section) => (
          <View key={section.section} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            <View style={styles.cardList}>
              {section.data.map((item) => (
                <TouchableOpacity key={item.id} style={styles.notificationCard}>
                  <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                    {/* Dynamic Icon Generic Placeholder */}
                    <View style={[styles.iconGraphic, { backgroundColor: item.iconColor }]} />
                  </View>

                  <View style={styles.contentContainer}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View style={styles.rightHeader}>
                        <Text style={styles.timeText}>{item.time}</Text>
                        {item.unread && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                    <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Mock */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={styles.navIconPlaceholder} />
          <Text style={styles.navLabel}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIconPlaceholder} />
          <Text style={styles.navLabel}>Browse</Text>
        </View>
        <View style={styles.navItem}>
          <View style={[styles.navIconPlaceholder, { backgroundColor: '#137FEC' }]}>
            <View style={styles.activeNavDot} />
          </View>
          <Text style={[styles.navLabel, { color: '#137FEC' }]}>Alerts</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIconPlaceholder} />
          <Text style={styles.navLabel}>Profile</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#137FEC',
  },
  filterSection: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: '#137FEC',
    borderColor: '#137FEC',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D6575',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  scrollContent: {
    backgroundColor: '#F8F9FB',
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingTop: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGraphic: {
    width: 18,
    height: 14,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#137FEC',
  },
  messageText: {
    fontSize: 13,
    color: '#5D6575',
    lineHeight: 18,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  navIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#9CA3AF',
    borderRadius: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeNavDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    backgroundColor: '#FF4D4D',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFF',
  }
});