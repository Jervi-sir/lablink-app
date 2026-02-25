import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 1, title: 'Proposal Received', date: 'Feb 24, 14:30 PM', completed: true },
  { id: 2, title: 'Order Confirmed', date: 'Feb 24, 15:45 PM', completed: true },
  { id: 3, title: 'Processing / Preparation', date: 'Processing', completed: false, current: true },
  { id: 4, title: 'Quality Check', date: 'Pending', completed: false },
  { id: 5, title: 'Ready for Collection / Shipped', date: 'Pending', completed: false },
];

export default function BusinessOrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order = {
    id: 'ORD-8821',
    status: 'Pending',
    student: 'Amine Kerroum',
    items: 'Digital Microscope X1',
    amount: '45,000 DA',
    date: '24 Feb, 14:30',
    emoji: '🔬'
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
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Order Details</Text>
        <TouchableOpacity style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 150 }}>

        {/* 1. Order Summary Card */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 }}>ORDER ID</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111', marginTop: 2 }}>{order.id}</Text>
            </View>
            <View style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: '#8B5CF6', textTransform: 'uppercase' }}>{order.status}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => navigation.navigate(Routes.BusinessStudentProfileScreen, {
              student: {
                name: order.student,
                online: true,
                avatar: order.student.charAt(0),
                role: 'PhD Researcher', // Mock data for profile
                department: 'Molecular Biology',
                university: 'USTHB University'
              }
            })}
          >
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#8B5CF6' }}>{order.student.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{order.student}</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>Researcher • University of Algiers</Text>
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 18, color: '#94A3B8' }}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2. Order Timeline / Workflow */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Fulfillment Workflow</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          {TRACKING_STEPS.map((step, index) => (
            <View key={step.id} style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center', width: 24 }}>
                <View style={[
                  { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, backgroundColor: '#FFF' },
                  step.completed ? { backgroundColor: '#10B981', borderColor: '#10B981' } : (step.current ? { borderColor: '#8B5CF6', backgroundColor: '#FFF' } : { borderColor: '#E2E8F0', backgroundColor: '#FFF' })
                ]}>
                  {step.completed && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '900' }}>✓</Text>}
                </View>
                {index < TRACKING_STEPS.length - 1 && <View style={[{ width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 }, step.completed && TRACKING_STEPS[index + 1].completed && { backgroundColor: '#10B981' }]} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 24 }}>
                <Text style={[{ fontSize: 15, fontWeight: '700', color: '#111' }, !step.completed && !step.current && { color: '#94A3B8' }]}>{step.title}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{step.date}</Text>
              </View>
              {step.current && (
                <TouchableOpacity style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: '800' }}>Update</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* 3. Items & Pricing */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Items & Financials</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, {
              product: {
                name: order.items,
                price: order.amount,
                image: order.emoji,
                status: 'Active',
                category: 'Optical Equipment' // Mock category for navigation
              }
            })}
          >
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>{order.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{order.items}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginTop: 2 }}>Quantity: 1 • View Product Details</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{order.amount}</Text>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />

          <View style={{ gap: 10, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>{order.amount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Tax (VAT 19%)</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>8,550 DA</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Grand Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#8B5CF6' }}>53,550 DA</Text>
            </View>
          </View>
        </View>

        {/* 4. Delivery Address */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Shipping / Delivery Details</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 32 }}>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>Faculty of Biological Sciences, University of Science and Technology Houari Boumediene (USTHB), Algiers, Algeria.</Text>
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#8B5CF6', fontSize: 14, fontWeight: '800' }}>View on Map</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Management Actions */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, {
            chat: {
              name: order.student,
              online: true,
              avatar: order.student.charAt(0)
            }
          })}
        >
          <Text style={{ color: '#475569', fontSize: 15, fontWeight: '700' }}>Message Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1.5, height: 56, borderRadius: 16, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800' }}>Advance to Next Stage</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

