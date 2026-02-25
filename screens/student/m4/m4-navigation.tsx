import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet, Dimensions, TextInput, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const CHATS_DATA = [
  {
    id: '1',
    name: 'Advanced Bio-Research Lab',
    lastMessage: 'The quote for the microscope has been updated.',
    time: '10:30 AM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'NanoTech Procurement',
    lastMessage: 'Your payment was successfully received.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Dr. Sarah (Genomics Dept)',
    lastMessage: 'Are the samples ready for collection tomorrow?',
    time: '2 days ago',
    unread: 1,
    online: true,
  },
  {
    id: '4',
    name: 'Global Lab Supplies',
    lastMessage: 'We have new inventory for chemical reagents.',
    time: 'Monday',
    unread: 0,
    online: false,
  },
];

export default function StudentM4Navigation() {
  const navigation = useNavigation<any>();

  const renderChat = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate(Routes.ChatDetailScreen, { chat: item })}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarPlaceholder} />
        {item.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatBtn}>
          <Text style={{ fontSize: 20 }}>📝</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <FlatList
        data={CHATS_DATA}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.listTitle}>All Chats</Text>}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFF',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  newChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  listContent: {
    paddingBottom: 40,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingBottom: 14,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    maxWidth: width * 0.5,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  lastMessageUnread: {
    color: '#1E293B',
    fontWeight: '800',
  },
  unreadBadge: {
    backgroundColor: '#137FEC',
    paddingHorizontal: 8,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
});