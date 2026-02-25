import React from "react";
import { View } from "react-native";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";

interface SettingItem {
  label: string;
  icon?: string;
  value?: string;
  count?: string;
  onPress?: () => void;
}

interface OptionSettingsProps {
  title: string;
  items: SettingItem[];
}

export const OptionSettings: React.FC<OptionSettingsProps> = ({ title, items }) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 12,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4
      }}>
        {title}
      </Text>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F8FAFC'
              },
              index === items.length - 1 && { borderBottomWidth: 0 }
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {item.icon && (
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
              )}
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{item.label}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {item.count && (
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC', backgroundColor: '#F0F7FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  {item.count}
                </Text>
              )}
              {item.value && <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>{item.value}</Text>}
              <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};