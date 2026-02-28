import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useNavigation } from "@react-navigation/native";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48 - 12) / 2;

const TABS = ['Products', 'Certifications'];

export default function LabProfileScreen() {
  const navigation = useNavigation<any>();
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const profileRes: any = await api.get(ApiRoutes.auth.business.me);
      const bProfile = profileRes.user?.businessProfile;
      setBusiness(bProfile);

      if (bProfile?.id) {
        const prodRes: any = await api.get(buildRoute(ApiRoutes.businesses.products, { id: bProfile.id }));
        setProducts(prodRes?.data || prodRes?.products?.data || prodRes || []);
      }
    } catch (error) {
      console.error("Error fetching lab profile data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </ScreenWrapper>
    );
  }

  const businessName = business?.name || 'My Laboratory';
  const wilayaName = business?.wilaya?.name || 'Location';
  const bio = business?.bio || 'No bio provided for this laboratory.';

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Nav */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal, zIndex: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Action icons could go here */}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />}
      >
        {/* Lab Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: paddingHorizontal, gap: 16, marginTop: 8, marginBottom: 20 }}>
          <View style={{ width: 80, height: 80, backgroundColor: '#D9D9D9', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>🔬</Text>
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>{businessName}</Text>
            <Text style={{ fontSize: 16, color: '#5D6575', fontWeight: '500' }}>{wilayaName}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 16, height: 16, backgroundColor: '#F59E0B', borderRadius: 8 }} />
            </View>
            <View>
              <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '600' }}>Products</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>{products.length}</Text>
            </View>
          </View>
        </View>

        {/* About Us */}
        <View style={{ paddingHorizontal: paddingHorizontal, marginBottom: 24, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>About us</Text>
          <Text style={{ fontSize: 14, color: '#5D6575', lineHeight: 20 }}>
            {bio}
          </Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, borderBottomWidth: 1, borderBottomColor: '#F0F2F5', marginBottom: 16 }}>
          {TABS.map((tab, index) => (
            <TouchableOpacity key={tab} style={[{ flex: 1, paddingVertical: 12, alignItems: 'center' }, index === 0 && { borderBottomWidth: 2, borderBottomColor: '#137FEC' }]}>
              <Text style={[{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }, index === 0 && { color: '#137FEC' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: paddingHorizontal, gap: 12 }}>
          {products.map((item: any) => (
            <View key={item.id} style={{ width: PRODUCT_CARD_WIDTH, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
              <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#1A2526', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, opacity: 0.5 }}>🧪</Text>
              </View>
              <View style={{ padding: 12, gap: 4 }}>
                <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '500' }}>{businessName}</Text>
                <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }} numberOfLines={1}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '800' }}>{item.price_dzd} DZD</Text>
                </View>
              </View>
            </View>
          ))}
          {products.length === 0 && (
            <Text style={{ padding: 20, textAlign: 'center', width: '100%', color: '#9CA3AF' }}>No products found</Text>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

