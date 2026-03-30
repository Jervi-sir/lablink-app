import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  failed_to_send: { en: 'Failed to send message. Please try again.', fr: 'Échec de l\'envoi du message. Veuillez réessayer.', ar: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.' },
  laboratory: { en: 'Laboratory', fr: 'Laboratoire', ar: 'المختبر' },
  online: { en: 'Online', fr: 'En ligne', ar: 'متصل' },
  offline: { en: 'Offline', fr: 'Hors ligne', ar: 'غير متصل' },
  type_message: { en: 'Type a message...', fr: 'Tapez un message...', ar: 'اكتب رسالة...' },
};

export default function ChatDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;
  const { conversation, chat } = route.params || {};

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

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
      console.error("Error loading user", e);
    }
  };

  const fetchMessages = useCallback(async (showLoading = true) => {
    if (!conversation?.id) return;
    if (showLoading) setIsLoading(true);
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.conversations.show, { id: conversation.id }));
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversation?.id]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !conversation?.id || isSending) return;

    setIsSending(true);
    const content = inputText.trim();
    setInputText("");

    try {
      await api.post(buildRoute(ApiRoutes.conversations.sendMessage, { id: conversation.id }), {
        content: content
      });
      fetchMessages(false);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(t('failed_to_send'));
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === currentUserId;
    return (
      <View style={[
        { padding: 14, borderRadius: 20, maxWidth: '80%' },
        isMe
          ? { alignSelf: language === 'ar' ? 'flex-start' : 'flex-end', backgroundColor: '#137FEC', borderBottomRightRadius: language === 'ar' ? 20 : 4, borderBottomLeftRadius: language === 'ar' ? 4 : 20 }
          : { alignSelf: language === 'ar' ? 'flex-end' : 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: language === 'ar' ? 20 : 4, borderBottomRightRadius: language === 'ar' ? 4 : 20, borderWidth: 1, borderColor: '#F1F5F9' }
      ]}>
        <Text style={[
          { fontSize: 15, lineHeight: 20 },
          isMe ? { color: '#FFF', fontWeight: '500' } : { color: '#1E293B', fontWeight: '500' },
          { textAlign: language === 'ar' ? 'right' : 'left' }
        ]}>
          {item.content}
        </Text>
        <Text style={[
          { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
          isMe ? { color: 'rgba(255,255,255,0.7)' } : { color: '#94A3B8' }
        ]}>
          {formatTime(item.created_at)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 70, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', [language === 'ar' ? 'marginRight' : 'marginLeft']: 8, gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>
          <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{chat?.name || t('laboratory')}</Text>
            <Text style={{ fontSize: 12, color: chat?.online ? '#10B981' : '#94A3B8', fontWeight: '600' }}>
              {chat?.online ? t('online') : t('offline')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#137FEC" size="large" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          inverted
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchMessages} colors={['#137FEC']} />
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'flex-end', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 20 }}>📎</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 }}>
            <TextInput
              style={{ fontSize: 15, color: '#1E293B', fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}
              placeholder={t('type_message')}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[
              { width: 44, height: 44, borderRadius: 22, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
              (!inputText.trim() || isSending) && { backgroundColor: '#E2E8F0' }
            ]}
            disabled={!inputText.trim() || isSending}
            onPress={handleSendMessage}
          >
            {isSending ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
                <Text style={{ fontSize: 18, color: '#FFF' }}>➜</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

