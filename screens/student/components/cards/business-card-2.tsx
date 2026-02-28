import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { Image, View } from "react-native";

export const BusinessCard2 = ({
  business, onPress
}: { business: any, onPress: () => void }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
        <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Image
            source={{ uri: business?.logo }}
            style={{ width: 48, height: 48, borderRadius: 16 }}
          />
        </View>
        <View style={{ gap: 2, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{business.name}</Text>
            {business.isNew && (
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 8, fontWeight: '800', color: '#16A34A' }}>NEW UPDATE</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>{business.university}</Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4 }}>👥 {business.followers} researchers following</Text>
        </View>
      </View>
      <TouchableOpacity style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>Following</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};