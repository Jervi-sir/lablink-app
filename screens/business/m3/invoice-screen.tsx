import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

export default function BusinessInvoiceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order = {
    id: 'ORD-8821',
    student: 'Amine Kerroum',
    items: 'Digital Microscope X1',
    amount: '45,000 DA',
    date: '24 Feb, 2024',
  } } = route.params || {};

  return (
    <ScreenWrapper style={{ backgroundColor: '#5D6575' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Invoice Document</Text>
        <TouchableOpacity style={{ padding: 8 }}>
          <Text style={{ color: '#8B5CF6', fontWeight: '800' }}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 60, alignItems: 'center' }}>

        {/* The Invoice Paper */}
        <View style={{
          width: width - 40,
          backgroundColor: '#FFF',
          padding: 24,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 10,
          marginBottom: 32,
        }}>
          {/* Lab Branding */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#111', letterSpacing: 0.5 }}>ADVANCED BIO-LABS</Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' }}>Route du Cap, Algiers, Algeria</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' }}>+213 550 123 456 | billing@biolabs.dz</Text>
            </View>
            <View style={{ width: 50, height: 50, borderRadius: 8, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>🧬</Text>
            </View>
          </View>

          <View style={{ height: 1.5, backgroundColor: '#F1F5F9', marginVertical: 24 }} />

          {/* Invoice Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', marginBottom: 8 }}>BILL TO:</Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#111' }}>{order.student}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' }}>Faculty of Biological Sciences</Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' }}>USTHB University</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 13, color: '#64748B' }}><Text style={{ fontWeight: '700', color: '#111' }}>Invoice #:</Text> INV-24-{(order.id || '8821')}</Text>
                <Text style={{ fontSize: 13, color: '#64748B' }}><Text style={{ fontWeight: '700', color: '#111' }}>Date:</Text> {order.date}</Text>
                <Text style={{ fontSize: 13, color: '#64748B' }}><Text style={{ fontWeight: '700', color: '#111' }}>Payment:</Text> Bank Transfer</Text>
              </View>
            </View>
          </View>

          {/* Table Header */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingVertical: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', flex: 2 }}>ITEM DESCRIPTION</Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', flex: 0.5, textAlign: 'center' }}>QTY</Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', flex: 1, textAlign: 'right' }}>TOTAL</Text>
          </View>

          {/* Table Row */}
          <View style={{ flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111', flex: 2 }}>{order.items}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111', flex: 0.5, textAlign: 'center' }}>1</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111', flex: 1, textAlign: 'right' }}>{order.amount}</Text>
          </View>

          {/* Totals Section */}
          <View style={{ marginTop: 32, alignSelf: 'flex-end', width: '60%', gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>{order.amount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>VAT (19%)</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>8,550 DA</Text>
            </View>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, marginTop: 4 }]}>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#111' }}>TOTAL AMOUNT</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#8B5CF6' }}>53,550 DA</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 60, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
            <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16, fontWeight: '500' }}>Thank you for your procurement. This is a computer-generated document and does not require a physical signature for digital validation.</Text>
          </View>
        </View>

        {/* Actions Outside Paper */}
        <TouchableOpacity style={{ width: '100%', height: 56, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Download Official PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '100%', height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Print Invoice</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

