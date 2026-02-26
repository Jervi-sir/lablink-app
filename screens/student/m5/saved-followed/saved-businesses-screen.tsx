import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { BusinessCard2 } from "../../components/cards/business-card-2";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";

export default function StudentSavedBusinessesScreen() {
  const navigation = useNavigation<any>();
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSavedLabs = useCallback(async () => {
    try {
      const response: any = await api.get(ApiRoutes.collections.savedBusinesses);
      setLabs(response.data || []);
    } catch (error) {
      console.error("Error fetching saved labs:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedLabs();
  }, [fetchSavedLabs]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchSavedLabs();
  };

  const renderLab = ({ item }: { item: any }) => (
    <BusinessCard2
      business={item}
      onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: item.name })}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Saved Laboratories</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#137FEC" size="large" />
        </View>
      ) : (
        <FlatList
          data={labs}
          renderItem={renderLab}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, paddingVertical: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>No saved laboratories yet.</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

