import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const ACTIVITIES = [
  { device: 'iPhone 15 Pro', location: 'Algiers, DZ', time: 'Active now', isCurrent: true },
  { device: 'MacBook Pro 14"', location: 'Algiers, DZ', time: '2 hours ago', isCurrent: false },
  { device: 'Chrome on Windows', location: 'Oran, DZ', time: 'Yesterday, 14:20', isCurrent: false },
];

export default function LoginActivityScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Login Activity</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 16, marginLeft: 4 }}>Where you're logged in</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
          {ACTIVITIES.map((item, index) => (
            <View key={index} style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }, index === ACTIVITIES.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>{item.device.includes('iPhone') ? '📱' : item.device.includes('Mac') ? '💻' : '🖥️'}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{item.device}{item.isCurrent && <Text style={{ color: '#10B981', fontSize: 12 }}> • Current</Text>}</Text>
                  <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{item.location} • {item.time}</Text>
                </View>
              </View>
              {!item.isCurrent && (
                <TouchableOpacity>
                  <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '700' }}>Log out</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

