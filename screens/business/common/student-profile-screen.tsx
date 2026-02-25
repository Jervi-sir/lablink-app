import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

export default function BusinessStudentProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { student = {
    name: 'Amine Kerroum',
    online: true,
    avatar: '👨‍🔬',
    role: 'PhD Researcher',
    department: 'Molecular Biology',
    university: 'USTHB University',
    bio: 'Specializing in advanced microscopy and genetic sequencing. Currently leading the Bio-Imaging project at Faculty of Biological Sciences.',
    ordersCount: 12,
    rating: 4.9,
    since: 'Oct 2023'
  } } = route.params || {};

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Researcher Profile</Text>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, {
            chat: { name: student.name, online: true, avatar: student.avatar }
          })}
        >
          <Text style={{ fontSize: 20 }}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Profile Hero */}
        <View style={{ alignItems: 'center', paddingVertical: 32, backgroundColor: '#FFF', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 }}>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <View style={{ width: 110, height: 110, borderRadius: 40, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 48 }}>{student.avatar || '🧪'}</Text>
            </View>
            {student.online && <View style={{ position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' }} />}
          </View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#111' }}>{student.name}</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#8B5CF6', marginTop: 4 }}>{student.role}</Text>
          <View style={{ marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>{student.university}</Text>
          </View>
        </View>

        {/* Business Stats */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: -24, zIndex: 10, marginBottom: 24 }}>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>{student.ordersCount}</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>Total Orders</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>{student.rating}</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>Buyer Rating</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>{student.since}</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>Member Since</Text>
          </View>
        </View>

        {/* Deep Info Sections */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>About Researcher</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' }}>{student.bio}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Academic Department</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>🧬</Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{student.department}</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>Faculty of Biological Sciences</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action History Preview */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Recent Acquisition Status</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
              <Text style={{ flex: 1, fontSize: 14, color: '#475569', fontWeight: '600' }}>Last order processed successfully (ORD-8821)</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>2h ago</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

