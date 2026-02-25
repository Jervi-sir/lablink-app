import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, TextInput, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const CHATS_DATA = [
  {
    id: '1',
    name: 'Amine Kerroum',
    role: 'PhD Researcher',
    lastMessage: 'Is the Digital Microscope X1 available for priority shipping?',
    time: '12:45 PM',
    unread: 3,
    online: true,
    avatar: '👨‍🔬',
  },
  {
    id: '2',
    name: 'Dr. Sarah B.',
    role: 'Faculty Dean, USTHB',
    lastMessage: 'Thank you for the invoice. Payment is being processed.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    avatar: '👩‍🔬',
  },
  {
    id: '3',
    name: 'Yanis Mahidi',
    role: 'Lab Assistant',
    lastMessage: 'We found a defect in the last stir bar shipment.',
    time: '2 days ago',
    unread: 1,
    online: true,
    avatar: '👨‍💻',
  },
  {
    id: '4',
    name: 'Lab Research Team 4',
    role: 'Multi-buyer Group',
    lastMessage: 'Requesting a quote for 50x Safety Goggles.',
    time: 'Monday',
    unread: 0,
    online: false,
    avatar: '🧪',
  },
];

export default function BusinessM4Navigation() {
  const navigation = useNavigation<any>();

  const renderChat = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', gap: 16 }}
      activeOpacity={0.7}
      onPress={() => navigation.navigate(Routes.ChatDetailScreen, { chat: item })}
    >
      <View style={{ position: 'relative' }}>
        <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
        </View>
        {item.online && <View style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />}
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#111', maxWidth: width * 0.45 }} numberOfLines={1}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#8B5CF6', fontWeight: '700', marginTop: 1 }}>{item.role}</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{item.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <Text style={[{ fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 }, item.unread > 0 && { color: '#111', fontWeight: '800' }]} numberOfLines={1}>
            {item.lastMessage}
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

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>Communications</Text>
          <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>Active research inquiries</Text>
        </View>
        <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#111' }}
            placeholder="Search researchers or messages..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <FlatList
        data={CHATS_DATA}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginVertical: 16 }}>All Conversations</Text>}
      />
    </ScreenWrapper>
  );
}