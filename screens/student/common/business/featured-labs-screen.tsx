import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { BusinessCard2 } from "../../../../components/cards/business-card-2";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";

export default function FeaturedLabsScreen() {
  const navigation = useNavigation<any>();
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLabs = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum > 1)) return;

    try {
      setLoading(true);
      const response = await api.get(buildRoute(ApiRoutes.businesses.featuredLabs), {
        params: { page: pageNum, per_page: 15 }
      });

      if (response && response.data) {
        // Map API data to BusinessCard2 format
        const mappedLabs = response.data.map((lab: any) => ({
          ...lab,
          id: lab.id.toString(),
          logo: lab.logo || '🧬', // Fallback emoji if no logo
          university: lab.wilaya?.name || 'Academic Institution',
          followers: lab.followers_count || '0',
          isNew: lab.is_featured
        }));

        setLabs(prev => pageNum === 1 ? mappedLabs : [...prev, ...mappedLabs]);
        setHasMore(!!response.next_page);
        if (response.next_page) setPage(response.next_page);
      }
    } catch (error) {
      console.error("Error fetching all featured labs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs(1);
  }, []);

  const renderLab = ({ item }: { item: any }) => (
    <BusinessCard2
      business={item}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { lab: item })}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }} statusBarStyle="dark-content">
      {/* Header */}
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Featured Laboratories</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={labs}
        renderItem={renderLab}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore && !loading) {
            fetchLabs(page);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color="#137FEC" />
            </View>
          ) : null
        )}
        ListEmptyComponent={() => (
          !loading ? (
            <View style={{ flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>No featured labs found.</Text>
            </View>
          ) : null
        )}
      />
    </ScreenWrapper>
  );
}
