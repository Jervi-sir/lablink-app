import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Alert, ActivityIndicator, Image, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";

export default function EstimationReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { estimation } = route.params || {};

  const [items, setItems] = useState<any[]>(estimation?.items?.map((item: any) => ({
    ...item,
    price: item.unitPrice ? String(item.unitPrice) : ""
  })) || []);
  
  const [extraFee, setExtraFee] = useState("0");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePriceChange = (index: number, value: string) => {
    const nextItems = [...items];
    nextItems[index].price = value.replace(/[^0-9.]/g, '');
    setItems(nextItems);
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((acc, curr) => {
      const p = parseFloat(curr.price) || 0;
      const q = curr.quantity || 1;
      return acc + (p * q);
    }, 0);
    const extra = parseFloat(extraFee) || 0;
    return itemsTotal + extra;
  };

  const submitQuote = async () => {
    if (items.some(item => !item.price || parseFloat(item.price) <= 0)) {
      Alert.alert("Invalid Prices", "Please provide a valid price for all items.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        items: items.map(item => ({
          id: item.id,
          unit_price: parseFloat(item.price)
        })),
        extra_fee: parseFloat(extraFee) || 0,
        notes: notes,
        status: 'quoted'
      };

      const response = await api.post(buildRoute(ApiRoutes.estimationRequests.show, { id: estimation.id }) + '/quote', payload);
      
      if (response) {
        Alert.alert("Success", "Quote sent to the researcher successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      Alert.alert("Error", "Failed to send quote. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!estimation) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Text>Estimation not found</Text>
           <TouchableOpacity onPress={() => navigation.goBack()}><Text>Go Back</Text></TouchableOpacity>
         </View>
      </ScreenWrapper>
    );
  }

  const researcher = estimation.user?.studentProfile || estimation.user;
  const researcherName = researcher?.fullName || researcher?.fullname || estimation.user?.email || "Researcher";

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Review Request</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Researcher Info */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
           <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12 }}>Researcher</Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
             <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {researcher?.profileImage ? (
                  <Image source={{ uri: researcher.profileImage }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={{ fontSize: 24 }}>👤</Text>
                )}
             </View>
             <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{researcherName}</Text>
                <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>Request #{estimation.code}</Text>
             </View>
           </View>
        </View>

        {/* Experiment Context */}
        {estimation.notes && (
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC', marginBottom: 4 }}>Researcher Notes:</Text>
            <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20, fontWeight: '500' }}>{estimation.notes}</Text>
          </View>
        )}

        {/* Pricing Table / List */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Itemized Pricing</Text>
          
          <View style={{ gap: 20 }}>
            {items.map((item, index) => (
              <View key={item.id} style={{ borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{item.productName}</Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>Quantity: {item.quantity}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                   <View style={{ flex: 1, height: 48, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginRight: 4 }}>DA</Text>
                      <TextInput
                        style={{ flex: 1, fontSize: 15, fontWeight: '800', color: '#111' }}
                        placeholder="Unit Price"
                        keyboardType="numeric"
                        value={item.price}
                        onChangeText={(v) => handlePriceChange(index, v)}
                      />
                   </View>
                   <View style={{ minWidth: 80, alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Subtotal</Text>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B' }}>
                        {((parseFloat(item.price) || 0) * (item.quantity || 1)).toLocaleString()} DA
                      </Text>
                   </View>
                </View>
              </View>
            ))}
          </View>

          {/* Extra Fee */}
          <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
             <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Service / Handling Fee</Text>
             <View style={{ height: 48, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#137FEC', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC', marginRight: 4 }}>DA</Text>
                <TextInput
                  style={{ flex: 1, fontSize: 15, fontWeight: '800', color: '#111' }}
                  placeholder="Additional charges..."
                  keyboardType="numeric"
                  value={extraFee}
                  onChangeText={(v) => setExtraFee(v.replace(/[^0-9.]/g, ''))}
                />
             </View>
          </View>
        </View>

        {/* Internal Notes */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
           <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Note to Researcher (Optional)</Text>
           <TextInput
             style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, height: 100, fontSize: 14, color: '#111', fontWeight: '500', textAlignVertical: 'top' }}
             placeholder="Exp: delivery time, quality details..."
             multiline
             numberOfLines={4}
             value={notes}
             onChangeText={setNotes}
           />
        </View>

        {/* Summary & Submit */}
        <View style={{ backgroundColor: '#1E293B', borderRadius: 24, padding: 24, marginBottom: 20 }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#94A3B8' }}>Grand Total Estimate</Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFF' }}>{calculateTotal().toLocaleString()} DA</Text>
           </View>
           <TouchableOpacity
             style={[{ height: 56, borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }, isSubmitting && { opacity: 0.7 }]}
             onPress={submitQuote}
             disabled={isSubmitting}
           >
             {isSubmitting ? (
               <ActivityIndicator size="small" color="#FFF" />
             ) : (
               <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Submit Price Quote</Text>
             )}
           </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
