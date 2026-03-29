import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');

export default function EstimationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { estimationId, estimation: navEstimation } = route.params || {};

  const [estimation, setEstimation] = useState<any>(navEstimation || null);
  const [loading, setLoading] = useState(!navEstimation);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchEstimation = useCallback(async () => {
    if (!estimationId && !navEstimation?.id) return;
    const id = estimationId || navEstimation.id;
    
    setLoading(true);
    try {
      const response = await api.get(buildRoute(ApiRoutes.estimationRequests.show, { id }));
      if (response && response.data) {
        setEstimation(response.data);
      }
    } catch (error) {
      console.error("Error fetching estimation detail:", error);
      Alert.alert("Error", "Failed to load estimation details.");
    } finally {
      setLoading(false);
    }
  }, [estimationId, navEstimation]);

  useEffect(() => {
    if (!navEstimation || estimationId) {
      fetchEstimation();
    }
  }, [fetchEstimation, navEstimation, estimationId]);

  const handleMessageVendor = async () => {
    const businessUserId = estimation?.business?.user_id;
    if (!businessUserId) {
      Alert.alert("Error", "Could not identify the business user to start a chat.");
      return;
    }

    setIsMessaging(true);
    try {
      const response = await api.post(ApiRoutes.conversations.store, {
        target_user_id: businessUserId
      });
      const conversation = response?.data;

      if (conversation) {
        navigation.navigate(Routes.ChatDetailScreen, { conversation });
      } else {
        Alert.alert("Error", "Failed to resolve conversation.");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      Alert.alert("Error", "Failed to message vendor. Please try again.");
    } finally {
      setIsMessaging(false);
    }
  };

  const handleConfirmQuote = async () => {
    Alert.alert(
      "Confirm Order",
      "Are you sure you want to convert this estimation into a formal order? This will finalize the price and create a delivery request.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm & Order", 
          onPress: async () => {
            setIsConfirming(true);
            try {
              const response = await api.post(buildRoute(ApiRoutes.estimationRequests.show, { id: estimation.id }) + '/confirm');
              if (response && response.data) {
                Alert.alert("Success", "Your order has been placed successfully!");
                navigation.navigate(Routes.OrderDetailScreen, { order: response.data });
              }
            } catch (error) {
              console.error("Error confirming quote:", error);
              Alert.alert("Error", "Failed to confirm quote. Please try again.");
            } finally {
              setIsConfirming(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#137FEC';
      case 'quoted': return '#137FEC';
      case 'reviewed': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!estimation) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Estimation not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#137FEC', fontWeight: '700' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Request #{estimation.code}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Status Card */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Current Status</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: getStatusColor(estimation.status), marginTop: 4 }}>
                {estimation.status?.toUpperCase()}
              </Text>
            </View>
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </View>
          </View>
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>Requested on</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
              {new Date(estimation.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Business Info */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 }}>Laboratory</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
              {estimation.business?.logo ? (
                <Image source={{ uri: estimation.business.logo }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
              ) : (
                <Text style={{ fontSize: 20 }}>🏢</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{estimation.business?.name}</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{estimation.business?.wilaya?.name || 'Algeria'}</Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Selected Items</Text>
            <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B' }}>{estimation.items?.length || 0} ITEMS</Text>
            </View>
          </View>
          
          <View style={{ gap: 16 }}>
            {estimation.items?.map((item: any) => (
              <View key={item.id} style={{ flexDirection: 'row', gap: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                <View style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
                  {item.productImageUrl ? (
                    <Image source={{ uri: item.productImageUrl }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                  ) : (
                    <Text style={{ fontSize: 24 }}>🔬</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{item.productName}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>Qty: {item.quantity}</Text>
                    {item.unitPrice && (
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC' }}>{Number(item.unitPrice).toLocaleString()} DA</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {estimation.extraFee > 0 && (
             <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Service/Handling Fee</Text>
               <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>{Number(estimation.extraFee).toLocaleString()} DA</Text>
             </View>
          )}

          {estimation.estimatedTotal && (
            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Grand Total Quote</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#137FEC' }}>{Number(estimation.estimatedTotal).toLocaleString()} DA</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        {(estimation.address || estimation.phone) && (
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 }}>Contact & Delivery</Text>
            <View style={{ gap: 12 }}>
              {estimation.address && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>Address</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{estimation.address}</Text>
                </View>
              )}
              {estimation.phone && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>Phone</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{estimation.phone}</Text>
                </View>
              )}
              {estimation.department && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>Dept.</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{estimation.department}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        {estimation.notes && (
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 }}>My Request Notes</Text>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>{estimation.notes}</Text>
          </View>
        )}

        {/* Quoting Notes from Lab */}
        {estimation.quotingNotes && (
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#137FEC', marginBottom: 12 }}>Laboratory Response</Text>
            <Text style={{ fontSize: 14, color: '#1E40AF', lineHeight: 22, fontWeight: '600' }}>{estimation.quotingNotes}</Text>
          </View>
        )}

        {/* Message Button */}
        <TouchableOpacity
          style={[{ height: 56, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginTop: 8 }, isMessaging && { opacity: 0.7 }]}
          onPress={handleMessageVendor}
          disabled={isMessaging}
        >
          {isMessaging ? <ActivityIndicator size="small" color="#111" /> : <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Message Laboratory</Text>}
        </TouchableOpacity>

        {/* Confirm Order Button - ONLY IF QUOTED */}
        {estimation.status === 'quoted' && (
          <TouchableOpacity
            style={[{ height: 56, borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center', marginTop: 12 }, isConfirming && { opacity: 0.7 }]}
            onPress={handleConfirmQuote}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Confirm & Place Order</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
