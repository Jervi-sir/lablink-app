import React, { useState, useEffect, useCallback, useRef } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, TextInput, Platform, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');

export default function BusinessM4Navigation() {
  const navigation = useNavigation<any>();
  const { auth: currentUser } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isFirstRender = useRef(true);

  const fetchConversations = useCallback(async (shouldRefresh: boolean = false) => {
    if (!shouldRefresh && !searchQuery) setIsLoading(true);
    try {
      const response: any = await api.get(ApiRoutes.conversations.index, {
        params: { q: searchQuery }
      });
      setConversations(response.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Debounced search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchConversations();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchConversations(true);
  };

  const getPartnerInfo = (conversation: any) => {
    const isUser1 = conversation.user1_id === currentUser?.id;
    const partner = isUser1 ? conversation.user2 : conversation.user1;

    if (partner.businessProfile) {
      return {
        name: partner.businessProfile.name,
        role: partner.businessProfile.businessCategory?.name || 'Facilities',
        avatar: '🏥',
        online: false
      };
    }

    return {
      name: partner.name || `${partner.studentProfile?.first_name} ${partner.studentProfile?.last_name}`,
      role: partner.studentProfile?.department?.name || 'Researcher',
      avatar: partner.studentProfile?.avatar || '👨‍🔬',
      online: true
    };
  };

  const renderChat = ({ item }: { item: any }) => {
    const partner = getPartnerInfo(item);
    const lastMsg = item.messages?.[0];
    const time = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', gap: 16 }}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.ChatDetailScreen, { conversationId: item.id, chat: { ...partner, id: item.id } })}
      >
        <View style={{ position: 'relative' }}>
          <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 24 }}>{partner.avatar}</Text>
          </View>
          {partner.online && <View style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#111', maxWidth: width * 0.45 }} numberOfLines={1}>{partner.name}</Text>
              <Text style={{ fontSize: 12, color: '#8B5CF6', fontWeight: '700', marginTop: 1 }}>{partner.role}</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{time}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Text style={[{ fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 }, item.unread > 0 && { color: '#111', fontWeight: '800' }]} numberOfLines={1}>
              {lastMsg?.content || lastMsg?.message || 'Started a conversation'}
            </Text>
            {item.unread > 0 && (
              <View style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 8, minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderChat}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
          }
          ListHeaderComponent={(
            <View style={{ paddingHorizontal: paddingHorizontal, paddingVertical: 16, paddingTop: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: 1 }}>All Conversations</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>No messages found</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 4 }}>Your research inquiries will appear here</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}