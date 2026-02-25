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
      style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF', gap: 16 }}
      activeOpacity={0.7}
      onPress={() => navigation.navigate(Routes.ChatDetailScreen, { chat: item })}
    >
      <View style={{ position: 'relative' }}>
        <View style={{ width: 60, height: 60, borderRadius: 22, backgroundColor: '#F1F5F9' }} />
        {item.online && <View style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />}
      </View>

      <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E293B', maxWidth: width * 0.5 }} numberOfLines={1}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{item.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[{ fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 }, item.unread > 0 && { color: '#1E293B', fontWeight: '800' }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={{ backgroundColor: '#137FEC', paddingHorizontal: 8, minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
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
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>Messages</Text>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>📝</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, height: 52 }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1E293B' }}
            placeholder="Search conversations..."
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
        ListHeaderComponent={<Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginVertical: 16 }}>All Chats</Text>}
      />
    </ScreenWrapper>
  );
}