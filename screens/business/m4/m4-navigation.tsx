import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Routes } from "@/utils/helpers/routes";
import { useConversationStore } from "@/zustand/conversation-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useLanguageStore } from "@/zustand/language-store";
import moment from "moment";

const { width } = Dimensions.get('window');

const translations = {
  messages: { en: 'Messages', fr: 'Messages', ar: 'الرسائل' },
  no_conversations: { en: 'No conversations found', fr: 'Aucune conversation trouvée', ar: 'لم يتم العثور على محادثات' },
  status_online: { en: 'Online', fr: 'En ligne', ar: 'متصل' },
};

export default function BusinessM4Navigation() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const { conversations, fetchConversations, isLoading, setActiveConversation } = useConversationStore();
  const { auth } = useAuthStore();

  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;

  useEffect(() => {
    fetchConversations();
  }, []);

  const renderChat = ({ item }: { item: any }) => {
    const isUser1 = item.user1_id === auth?.id;
    const partner = isUser1 ? item.user2 : item.user1;
    const partnerProfile = partner?.business_profile || partner?.student_profile;
    const partnerName = partnerProfile?.name || partnerProfile?.fullname || partner?.name || 'User';
    const partnerAvatar = partnerProfile?.logo || partnerProfile?.profile_image;
    
    const lastMsg = item.messages?.[0];
    const time = lastMsg ? moment(lastMsg.created_at).fromNow() : '';

    return (
      <TouchableOpacity
        style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', gap: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}
        activeOpacity={0.7}
        onPress={() => {
            setActiveConversation(item);
            navigation.navigate(Routes.ChatDetailScreen, { id: item.id });
        }}
      >
        <View style={{ position: 'relative' }}>
          {partnerAvatar ? (
            <Image source={{ uri: partnerAvatar }} style={{ width: 60, height: 60, borderRadius: 22, backgroundColor: '#F1F5F9' }} />
          ) : (
            <View style={{ width: 60, height: 60, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#137FEC' }}>{partnerName.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E293B' }} numberOfLines={1}>{partnerName}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{time}</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }} numberOfLines={1}>
             {lastMsg?.type === 'image' ? '📷 Photo' : (lastMsg?.message || 'Started a conversation')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>{t('messages')}</Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderChat}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchConversations} tintColor="#137FEC" />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
              <Text style={{ color: '#94A3B8', fontWeight: '600' }}>{t('no_conversations')}</Text>
            </View>
          ) : (
            <View style={{ marginTop: 40 }}>
                <ActivityIndicator size="large" color="#137FEC" />
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
}