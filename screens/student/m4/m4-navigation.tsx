import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, TextInput, Platform, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');

export default function StudentM4Navigation() {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      }
    } catch (e) {
      console.error("Error loading user from storage", e);
    }
  };

  const fetchConversations = useCallback(async (page: number | null, refreshing = false) => {
    if (page === null) return;

    if (refreshing) setIsRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response: any = await api.get(ApiRoutes.conversations.index, {
        params: {
          page,
          q: search || undefined
        }
      });

      const newConvos = response.data || [];
      if (refreshing || page === 1) {
        setConversations(newConvos);
      } else {
        setConversations(prev => [...prev, ...newConvos]);
      }
      setNextPage(response.next_page);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConversations(1);
    }, search ? 500 : 0);
    return () => clearTimeout(timer);
  }, [fetchConversations, search]);

  const onRefresh = () => {
    fetchConversations(1, true);
  };

  const loadMore = () => {
    if (!isLoadingMore && nextPage) {
      fetchConversations(nextPage);
    }
  };

  const getTargetUser = (item: any) => {
    if (!currentUserId) return null;
    return item.user1_id === currentUserId ? item.user2 : item.user1;
  };

  const formatChatData = (item: any) => {
    const target = getTargetUser(item);
    const lastMsg = item.messages?.[0];

    // Determine name: Business name or Student name
    let displayName = "User";
    if (target?.businessProfile) displayName = target.businessProfile.name;
    else if (target?.studentProfile) displayName = target.studentProfile.first_name + " " + target.studentProfile.last_name;
    else if (target?.name) displayName = target.name;

    const time = lastMsg
      ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "";

    return {
      id: item.id.toString(),
      name: displayName,
      lastMessage: lastMsg?.content || "No messages yet",
      time: time,
      unread: 0, // Backend doesn't support unread count yet
      online: false, // Backend doesn't support online status yet
      targetUser: target,
    };
  };

  const renderChat = ({ item }: { item: any }) => {
    const chat = formatChatData(item);
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, paddingVertical: 8, gap: 16 }}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.ChatDetailScreen, { conversation: item, chat })}
      >
        <View style={{ position: 'relative' }}>
          <View style={{ width: 60, height: 60, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          {chat.online && <View style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E293B', maxWidth: width * 0.5 }} numberOfLines={1}>{chat.name}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{chat.time}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[{ fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 }, chat.unread > 0 && { color: '#1E293B', fontWeight: '800' }]} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
            {chat.unread > 0 && (
              <View style={{ backgroundColor: '#137FEC', paddingHorizontal: 8, minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFF' }}>{chat.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>Messages</Text>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>📝</Text>
        </TouchableOpacity>
      </View>

      {isLoading && conversations.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#137FEC" size="large" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderChat}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />
          }
          ListFooterComponent={isLoadingMore ? <ActivityIndicator color="#137FEC" style={{ marginVertical: 16 }} /> : null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ color: '#94A3B8', fontWeight: '600' }}>No conversations found</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}