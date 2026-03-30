import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet, Dimensions } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";


import { useConversationStore } from "@/zustand/conversation-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image } from "react-native";

const SUGGESTIONS = {
  en: ['Check pricing', 'Request extension', 'Call Lab'],
  fr: ['Vérifier les tarifs', 'Demander une prolongation', 'Appeler le laboratoire'],
  ar: ['تحقق من الأسعار', 'طلب تمديد', 'الاتصال بالمختبر'],
};

const translations = {
  active_now: { en: 'Active Now', fr: 'En ligne', ar: 'نشط الآن' },
  order_prefix: { en: 'Order', fr: 'Commande', ar: 'طلب' },
  dna_sequencing: { en: 'DNA Sequencing - Processing', fr: 'Séquençage d’ADN - En cours', ar: 'تسلسل الحمض النووي - قيد المعالجة' },
  today: { en: 'Today', fr: 'Aujourd\'hui', ar: 'اليوم' },
  type_message: { en: 'Type a message...', fr: 'Écrivez un message...', ar: 'اكتب رسالة...' },
};

export default function ShowConversationScreen() {
  const language = useLanguageStore((state) => state.language);
  const { activeConversation, fetchConversationDetails, sendMessage, isSending } = useConversationStore();
  const { auth } = useAuthStore();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [inputText, setInputText] = useState('');

  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;
  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.en;

  useEffect(() => {
    if (route.params?.id) {
       fetchConversationDetails(route.params.id);
    }
  }, [route.params?.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeConversation) return;
    const text = inputText;
    setInputText('');
    await sendMessage(activeConversation.id, text);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && activeConversation) {
      await sendMessage(activeConversation.id, '', result.assets[0]);
    }
  };

  const getOtherUser = () => {
    if (!activeConversation) return null;
    return activeConversation.user1_id === auth?.id ? activeConversation.user2 : activeConversation.user1;
  };

  const otherUser = getOtherUser();
  const otherUserProfile = otherUser?.business_profile || otherUser?.student_profile;
  const otherUserName = otherUserProfile?.name || otherUserProfile?.fullname || 'User';
  const otherUserAvatar = otherUserProfile?.logo || otherUserProfile?.profile_image;

  if (!activeConversation) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
        <View style={[styles.headerLeft, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <View style={[styles.backArrow, { transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] }]} />
          </TouchableOpacity>
          <View style={styles.labAvatarContainer}>
            {otherUserAvatar ? (
               <Image source={{ uri: otherUserAvatar }} style={styles.labAvatar} />
            ) : (
               <View style={styles.labAvatar} />
            )}
            <View style={[styles.onlineStatus, { right: language === 'ar' ? undefined : -2, left: language === 'ar' ? -2 : undefined }]} />
          </View>
          <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={styles.labName}>{otherUserName}</Text>
            <Text style={styles.onlineText}>{t('active_now')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoBtn}>
          <View style={styles.infoIcon} />
        </TouchableOpacity>
      </View>

      {/* Contextual Order Info */}
      <View style={[styles.orderContextBar, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
        <View style={[styles.contextLeft, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
          <View style={styles.contextIconBox}>
            <View style={styles.flaskIcon} />
          </View>
          <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={styles.contextTitle}>{t('order_prefix')} #4092</Text>
            <Text style={styles.contextSub}>{t('dna_sequencing')}</Text>
          </View>
        </View>
        <View style={[styles.contextArrow, { transform: [{ rotate: language === 'ar' ? '225deg' : '45deg' }] }]} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <Text style={styles.dateText}>{t('today')}</Text>
        </View>

        {activeConversation.messages.slice().reverse().map((msg, index, array) => {
          const isMe = msg.sender_id === auth?.id;
          const showAvatar = !isMe && (index === 0 || array[index-1].sender_id !== msg.sender_id);
          
          return (
            <View key={msg.id} style={[
              styles.messageRow,
              { flexDirection: language === 'ar' ? 'row-reverse' : 'row' },
              isMe ? styles.myMessageRow : styles.theirMessageRow
            ]}>
              {!isMe && (
                <View style={styles.avatarSpace}>
                  {showAvatar && (
                    otherUserAvatar ? (
                        <Image source={{ uri: otherUserAvatar }} style={styles.theirAvatar} />
                    ) : (
                        <View style={[styles.theirAvatar, { backgroundColor: '#E7F2FD', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#137FEC' }}>{otherUserName.charAt(0)}</Text>
                        </View>
                    )
                  )}
                </View>
              )}

              <View style={[
                styles.bubbleContainer,
                isMe ? styles.myBubbleContainer : styles.theirBubbleContainer,
                { alignItems: isMe ? (language === 'ar' ? 'flex-start' : 'flex-end') : (language === 'ar' ? 'flex-end' : 'flex-start') }
              ]}>
                <View style={[
                  styles.bubble,
                  isMe ? styles.myBubble : styles.theirBubble,
                  isMe ? (language === 'ar' ? { borderBottomLeftRadius: 4, borderBottomRightRadius: 16 } : { borderBottomRightRadius: 4, borderBottomLeftRadius: 16 }) : (language === 'ar' ? { borderBottomRightRadius: 4, borderBottomLeftRadius: 16 } : { borderBottomLeftRadius: 4, borderBottomRightRadius: 16 })
                ]}>
                  {msg.type === 'image' && msg.object?.url ? (
                    <Image source={{ uri: msg.object.url }} style={{ width: 200, height: 200, borderRadius: 8, marginBottom: msg.message ? 8 : 0 }} resizeMode="cover" />
                  ) : null}
                  {msg.message ? (
                    <Text style={[
                      styles.messageText,
                      isMe ? styles.myMessageText : styles.theirMessageText,
                      { textAlign: language === 'ar' ? 'right' : 'left' }
                    ]}>{msg.message}</Text>
                  ) : null}
                </View>
                <Text style={styles.timeText}>{moment(msg.created_at).format('HH:mm')}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputSection}>
        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.suggestionsScroll, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
          {currentSuggestions.map((item) => (
            <TouchableOpacity key={item} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity style={styles.attachBtn} onPress={handlePickImage}>
            <View style={styles.paperclipIcon} />
          </TouchableOpacity>
          <View style={[styles.textInputWrapper, { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }]}>
            <TextInput
              placeholder={t('type_message')}
              style={[styles.textInput, { textAlign: language === 'ar' ? 'right' : 'left' }]}
              placeholderTextColor="#A0AEC0"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={isSending}>
              {isSending ? (
                <ActivityIndicator size="small" color="#137FEC" />
              ) : (
                <View style={[styles.sendIcon, { transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }]} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 8,
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#111',
    transform: [{ rotate: '-45deg' }],
  },
  labAvatarContainer: {
    position: 'relative',
  },
  labAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#1A2526',
    borderRadius: 10,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  labName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#137FEC',
  },
  infoBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  orderContextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contextIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#E7F2FD',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flaskIcon: {
    width: 10,
    height: 14,
    backgroundColor: '#137FEC',
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  contextSub: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  contextArrow: {
    width: 8,
    height: 8,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: '#9CA3AF',
    transform: [{ rotate: '45deg' }],
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    fontSize: 11,
    fontWeight: '700',
    color: '#5D6575',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  avatarSpace: {
    width: 32,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  theirAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#1A2526',
    borderRadius: 8,
  },
  bubbleContainer: {
    maxWidth: '80%',
    gap: 4,
  },
  myBubbleContainer: {
    alignItems: 'flex-end',
  },
  theirBubbleContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#137FEC',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  myMessageText: {
    color: '#FFF',
  },
  theirMessageText: {
    color: '#111',
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  inputSection: {
    backgroundColor: '#FFF',
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  suggestionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5D6575',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  attachBtn: {
    padding: 8,
  },
  paperclipIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  textInputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },
  sendBtn: {
    padding: 4,
  },
  sendIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: '#137FEC',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  }
});