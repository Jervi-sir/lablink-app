import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { OptionWithSwitch } from "../../components/options/option-with-switch";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const renderToggle = (label: string, value: boolean, onValueChange: (v: boolean) => void) => (
    <OptionWithSwitch
      label={label}
      value={value}
      onValueChange={onValueChange}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ padding: 20 }}>
        {renderToggle("Order Status Updates", orderUpdates, setOrderUpdates)}
        {renderToggle("New Chat Messages", chatMessages, setChatMessages)}
        {renderToggle("New Inventory & Promotions", promotions, setPromotions)}
      </View>
    </ScreenWrapper>
  );
}

