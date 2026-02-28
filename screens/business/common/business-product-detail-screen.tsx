import React, { useState, useEffect, useCallback } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, LayoutAnimation, UIManager, ActivityIndicator, Alert, RefreshControl, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import StatsIcon from "@/assets/icons/stats-icon";
import InfoIcon from "@/assets/icons/info-icon";
import SpecsIcon from "@/assets/icons/specs-icon";
import { paddingHorizontal } from "@/utils/variables/styles";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const SECTIONS = [
  { id: 'stats', title: 'Performance Stats', icon: <StatsIcon /> },
  { id: 'specs', title: 'Specifications', icon: <SpecsIcon /> },
  { id: 'desc', title: 'Description', icon: <InfoIcon /> },
];

export default function BusinessProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialProduct = route.params?.product;

  const [product, setProduct] = useState<any>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>('stats');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProductDetail = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.products.show, { id: product.id }));
      if (response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [product?.id]);

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProductDetail(false);
  };

  const toggleAvailability = async () => {
    setIsActionLoading(true);
    try {
      const response: any = await api.put(buildRoute(ApiRoutes.products.update, { id: product.id }), {
        is_available: !product.isAvailable
      });
      if (response.data) {
        setProduct({ ...product, isAvailable: !product.isAvailable });
        Alert.alert("Success", `Product marked as ${!product.isAvailable ? 'available' : 'private'}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update product status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteProduct = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await api.delete(buildRoute(ApiRoutes.products.destroy, { id: product.id }));
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            } finally {
              setIsActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'stats':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Total Revenue</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0 DA</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Page Views</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{Math.floor(Math.random() * 500)}</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Sales Count</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Conversions</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0%</Text>
              </View>
            </View>
          </View>
        );
      case 'specs':
        const specs = product.specifications || {};
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            {Object.keys(specs).length > 0 ? (
              Object.entries(specs).map(([key, val]: [string, any]) => (
                <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                  <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>{key}</Text>
                  <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{val}</Text>
                </View>
              ))
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>SKU</Text>
                <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{product.sku || 'N/A'}</Text>
              </View>
            )}
          </View>
        );
      case 'desc':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
              {product.description || 'No description available.'}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (isLoading && !product) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  const statusText = product.isAvailable ? 'Active' : 'Draft';
  const priceText = `${product.price.toLocaleString()} DA`;

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Premium Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: paddingHorizontal,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Inventory Detail</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product })}
        >
          <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 13 }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: paddingHorizontal }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Product Image Stage */}
        <View style={{ width: width - 40, height: width - 40, backgroundColor: '#FFF', borderRadius: 32, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 3, alignSelf: 'center', marginTop: 20 }}>
          {product.images && product.images.length > 0 ? (
            <>
              <FlatList
                data={product.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e: any) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }: { item: any }) => (
                  <ScrollView
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ width: width - 40, height: width - 40 }}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </ScrollView>
                )}
                keyExtractor={(_: any, index: number) => index.toString()}
              />
              {product.images.length > 1 && (
                <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 6, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                  {product.images.map((_: any, idx: number) => (
                    <View
                      key={idx}
                      style={[
                        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
                        idx === activeImageIndex && { width: 16, backgroundColor: '#8B5CF6' }
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 80 }}>{product.category?.code === 'Reagent' ? '🧪' : '🔬'}</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 12 }}>No images uploaded</Text>
            </View>
          )}
        </View>

        {/* Vital Info */}
        <View style={{ paddingVertical: 20, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase' }}>{product.category?.code || 'Equipment'}</Text>
            <View style={[
              { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
              product.isAvailable ? { backgroundColor: '#F0FDF4' } : { backgroundColor: '#FFFBEB' }
            ]}>
              <Text style={[{ fontSize: 10, fontWeight: '800' }, product.isAvailable ? { color: '#16A34A' } : { color: '#D97706' }]}>{statusText}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 }}>{product.name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{priceText}</Text>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{product.stock} units available</Text>
          </View>
        </View>

        {/* Management Sections */}
        <View style={{ gap: 12, marginBottom: 32 }}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[
                { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
                isExpanded && { borderColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }
              ]}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16 }}>{section.icon}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#334155' }}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: '-45deg' }] },
                    isExpanded && { transform: [{ rotate: '45deg' }], borderColor: '#8B5CF6' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>

        {/* Delete Action */}
        <View style={{}}>
          <TouchableOpacity
            style={{ backgroundColor: '#FEF2F2', height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' }}
            onPress={deleteProduct}
          >
            <Text style={{ color: '#EF4444', fontWeight: '800' }}>Delete Listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Business Actions */}
      <View style={{ paddingHorizontal: paddingHorizontal, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingVertical: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ flex: 2, backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Promote Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#F1F5F9', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
          onPress={toggleAvailability}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <ActivityIndicator color="#475569" />
          ) : (
            <Text style={{ color: '#475569', fontSize: 14, fontWeight: '700' }}>{product.isAvailable ? 'Mark Private' : 'Make Public'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

