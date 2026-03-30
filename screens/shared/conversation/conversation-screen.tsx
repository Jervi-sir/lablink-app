import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet, Dimensions } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";
import { useConversationStore } from "@/zustand/conversation-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import moment from "moment";
import { ActivityIndicator, Image } from "react-native";

const translations = {
  messages: { en: 'Messages', fr: 'Messages', ar: 'الرسائل' },
  search_placeholder: { en: 'Search labs or messages...', fr: 'Rechercher des laboratoires ou des messages...', ar: 'ابحث عن مختبرات أو رسائل...' },
  recent: { en: 'RECENT', fr: 'RÉCENT', ar: 'الأحدث' },
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  search: { en: 'Search', fr: 'Rechercher', ar: 'بحث' },
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  profile: { en: 'Profile', fr: 'Profil', ar: 'الملف الشخصي' },
};

export default function ConversationScreen() {
  const language = useLanguageStore((state) => state.language);
  const { conversations, isLoading, fetchConversations, initReverb, setActiveConversation } = useConversationStore();
  const { auth } = useAuthStore();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;

  useEffect(() => {
    fetchConversations();
    initReverb();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    fetchConversations(text);
  };

  const getOtherUser = (item: any) => {
    return item.user1_id === auth?.id ? item.user2 : item.user1;
  };

  const getOtherUserProfile = (user: any) => {
    return user?.business_profile || user?.student_profile;
  };

  const getName = (user: any) => {
    const profile = getOtherUserProfile(user);
    return profile?.name || profile?.fullname || 'User';
  };

  const getAvatar = (user: any) => {
    const profile = getOtherUserProfile(user);
    return profile?.logo || profile?.profile_image;
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
        <Text style={styles.headerTitle}>{t('messages')}</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <View style={styles.composeIcon} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
          <View style={[styles.searchIcon, { marginRight: language === 'ar' ? 0 : 10, marginLeft: language === 'ar' ? 10 : 0 }]} />
          <TextInput
            placeholder={t('search_placeholder')}
            style={[styles.searchInput, { textAlign: language === 'ar' ? 'right' : 'left' }]}
            placeholderTextColor="#A0AEC0"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section Title */}
        <Text style={[styles.sectionTitle, { textAlign: language === 'ar' ? 'right' : 'left' }]}>{t('recent')}</Text>

        {/* Loading State */}
        {isLoading && conversations.length === 0 && (
          <ActivityIndicator size="large" color="#137FEC" style={{ marginTop: 20 }} />
        )}

        {/* Conversation List */}
        <View style={styles.listContainer}>
          {conversations.map((item) => {
            const otherUser = getOtherUser(item);
            const lastMsg = item.messages?.[0];
            const name = getName(otherUser);
            const avatar = getAvatar(otherUser);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                   setActiveConversation(item);
                   navigation.navigate('ShowConversation', { id: item.id });
                }}
                style={[
                  styles.conversationItem,
                  { flexDirection: language === 'ar' ? 'row-reverse' : 'row' },
                ]}
              >
                <View style={styles.avatarContainer}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarPlaceholder} />
                  ) : (
                    <View style={styles.initialsAvatar}>
                      <Text style={styles.initialsText}>{name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  {/* {otherUser.online && <View style={[styles.onlineStatus, { right: language === 'ar' ? undefined : 2, left: language === 'ar' ? 2 : undefined }]} />} */}
                </View>

                <View style={[styles.contentContainer, { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }]}>
                  <View style={[styles.itemHeader, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.labName, { textAlign: language === 'ar' ? 'right' : 'left' }]} numberOfLines={1}>{name}</Text>
                    <Text style={styles.timeText}>{lastMsg ? moment(lastMsg.created_at).fromNow(true) : ''}</Text>
                  </View>

                  <View style={[styles.itemFooter, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.lastMessage, { textAlign: language === 'ar' ? 'right' : 'left' }]} numberOfLines={1}>
                      {lastMsg?.type === 'image' ? 'Sent an image' : (lastMsg?.message || 'No messages yet')}
                    </Text>
                    {item.unread_count && item.unread_count > 0 ? (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread_count}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav Mock */}
      <View style={[styles.bottomNav, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>{t('home')}</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>{t('search')}</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>{t('orders')}</Text>
        </View>
        <View style={styles.navItem}>
          <View style={[styles.navIcon, { backgroundColor: '#137FEC' }]}>
            <View style={styles.activeNavDot} />
          </View>
          <Text style={[styles.navLabel, { color: '#137FEC' }]}>{t('messages')}</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>{t('profile')}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
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
  composeBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composeIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#137FEC',
    borderRadius: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A0AEC0',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    marginBottom: 12,
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  featuredItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: '#1A2526',
    borderRadius: 28,
  },
  initialsAvatar: {
    width: 56,
    height: 56,
    backgroundColor: '#E7F2FD',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#137FEC',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#137FEC',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13,
    color: '#5D6575',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#137FEC',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
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
  navIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#9CA3AF',
    borderRadius: 6,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  activeNavDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#FF4D4D',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  }
});
