import Text from "@/components/text";
import { Switch, View } from "react-native";

export const OptionWithSwitch = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (v: boolean) => void }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
      />
    </View>
  );
};