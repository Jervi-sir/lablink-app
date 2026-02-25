import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

const MOCK_MESSAGES = [
  { id: '1', text: 'Hello! I am interested in the Digital LCD Microscope.', sender: 'me', time: '10:00 AM' },
  { id: '2', text: 'Hello Dr. Amine! Of course, how can I help you today?', sender: 'them', time: '10:02 AM' },
  { id: '3', text: 'I would like to know if it is possible to get a discount for a bulk order of 5 units.', sender: 'me', time: '10:05 AM' },
  { id: '4', text: 'Let me check with the sales department. I will get back to you in a few minutes.', sender: 'them', time: '10:10 AM' },
  { id: '5', text: 'The quote for the microscope has been updated. You can check it in your orders section.', sender: 'them', time: '10:30 AM' },
];

export default function ChatDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { chat = { name: 'Laboratory' } } = route.params || {};
  const [inputText, setInputText] = useState("");

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[
        { padding: 14, borderRadius: 20, maxWidth: '80%' },
        isMe ? { alignSelf: 'flex-end', backgroundColor: '#137FEC', borderBottomRightRadius: 4 } : { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F1F5F9' }
      ]}>
        <Text style={[
          { fontSize: 15, lineHeight: 20 },
          isMe ? { color: '#FFF', fontWeight: '500' } : { color: '#1E293B', fontWeight: '500' }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
          isMe ? { color: 'rgba(255,255,255,0.7)' } : { color: '#94A3B8' }
        ]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 70, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8, gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#F1F5F9' }} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{chat.name}</Text>
            <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '600' }}>{chat.online ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 20 }}>📎</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 }}>
            <TextInput
              style={{ fontSize: 15, color: '#1E293B', fontWeight: '500' }}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[
              { width: 44, height: 44, borderRadius: 22, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
              !inputText && { backgroundColor: '#E2E8F0' }
            ]}
            disabled={!inputText}
          >
            <Text style={{ fontSize: 18, color: '#FFF' }}>➜</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

