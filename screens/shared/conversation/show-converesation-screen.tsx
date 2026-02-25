import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet, Dimensions } from "react-native";

const MESSAGES = [
  {
    id: '1',
    text: 'Hello! Your sample #4092 has been received safely at our facility.',
    time: '9:41 AM',
    isMe: false,
    showAvatar: true
  },
  {
    id: '2',
    text: 'Great, thanks for the update! When can I expect the preliminary results?',
    time: '9:43 AM',
    isMe: true
  },
  {
    id: '3',
    text: 'We are processing it now. The sequencing usually takes about 6-8 hours.',
    time: '9:45 AM',
    isMe: false,
    showAvatar: false
  },
  {
    id: '4',
    text: 'You can expect a full PDF report by 5 PM today.',
    time: '9:45 AM',
    isMe: false,
    showAvatar: true
  },
  {
    id: '5',
    text: 'Perfect. I also have the additional consent form you asked for.',
    time: '9:47 AM',
    isMe: true
  },
];

const SUGGESTIONS = ['Check pricing', 'Request extension', 'Call Lab'];

export default function ShowConversationScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn}>
            <View style={styles.backArrow} />
          </TouchableOpacity>
          <View style={styles.labAvatarContainer}>
            <View style={styles.labAvatar} />
            <View style={styles.onlineStatus} />
          </View>
          <View>
            <Text style={styles.labName}>BioGenetics Lab A</Text>
            <Text style={styles.onlineText}>Active Now</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoBtn}>
          <View style={styles.infoIcon} />
        </TouchableOpacity>
      </View>

      {/* Contextual Order Info */}
      <View style={styles.orderContextBar}>
        <View style={styles.contextLeft}>
          <View style={styles.contextIconBox}>
            <View style={styles.flaskIcon} />
          </View>
          <View>
            <Text style={styles.contextTitle}>Order #4092</Text>
            <Text style={styles.contextSub}>DNA Sequencing - Processing</Text>
          </View>
        </View>
        <View style={styles.contextArrow} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chatContainer}>
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <Text style={styles.dateText}>Today</Text>
        </View>

        {MESSAGES.map((msg) => (
          <View key={msg.id} style={[
            styles.messageRow,
            msg.isMe ? styles.myMessageRow : styles.theirMessageRow
          ]}>
            {!msg.isMe && (
              <View style={styles.avatarSpace}>
                {msg.showAvatar && <View style={styles.theirAvatar} />}
              </View>
            )}

            <View style={[
              styles.bubbleContainer,
              msg.isMe ? styles.myBubbleContainer : styles.theirBubbleContainer
            ]}>
              <View style={[
                styles.bubble,
                msg.isMe ? styles.myBubble : styles.theirBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.isMe ? styles.myMessageText : styles.theirMessageText
                ]}>{msg.text}</Text>
              </View>
              <Text style={styles.timeText}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputSection}>
        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {SUGGESTIONS.map((item) => (
            <TouchableOpacity key={item} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <View style={styles.paperclipIcon} />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              placeholder="Type a message..."
              style={styles.textInput}
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity style={styles.sendBtn}>
              <View style={styles.sendIcon} />
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