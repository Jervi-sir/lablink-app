import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

const FAQS = [
  { q: "How do I track my order?", a: "You can track your order in the 'My Orders' section of the app. We provide real-time updates as your equipment moves from proposal to delivery." },
  { q: "Can I cancel a procurement request?", a: "Yes, you can cancel a request as long as the status is 'Proposal Submitted'. Once payment is confirmed, please contact the laboratory directly." },
  { q: "How do I contact a vendor?", a: "Go to your order details and tap 'Message Vendor'. You can also find laboratory contact information on their profile page." },
  { q: "What is LabLink's tax policy?", a: "Taxes are calculated based on the laboratory's location and the type of research equipment being purchased." },
];

export default function FAQScreen() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>FAQs</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {FAQS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}
            onPress={() => setExpanded(expanded === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: '#1E293B', paddingRight: 12 }}>{item.q}</Text>
              <View style={[
                { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '45deg' }] },
                expanded === index && { transform: [{ rotate: '-135deg' }], marginTop: 4 }
              ]} />
            </View>
            {expanded === index && (
              <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginTop: 12, borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 12 }}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

