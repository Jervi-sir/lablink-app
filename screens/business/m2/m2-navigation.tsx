import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";

const { width } = Dimensions.get('window');

const MOCK_PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', category: 'Optical Equipment', price: '45,000 DA', stock: 8, status: 'Active', image: '🔬' },
  { id: '2', name: 'Magnetic Stirrer', category: 'Chemical Tools', price: '12,500 DA', stock: 15, status: 'Active', image: '🧪' },
  { id: '3', name: 'Borosil Glass Beakers', category: 'Glassware', price: '1,200 DA', stock: 0, status: 'Out of Stock', image: '🧪' },
  { id: '4', name: 'Centrifuge Machine', category: 'Laboratory Gear', price: '85,000 DA', stock: 3, status: 'Active', image: '🌀' },
  { id: '5', name: 'Safety Equipment Set', category: 'Safety', price: '5,500 DA', stock: 24, status: 'Draft', image: '🥽' },
  { id: '6', name: 'Electric Bunsen Burner', category: 'Heating', price: '18,000 DA', stock: 5, status: 'Active', image: '🔥' },
];

export default function BusinessM2Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['All', 'Active', 'Out of Stock', 'Draft'];

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderProductItem = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={{
      backgroundColor: '#FFF',
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#F1F5F9',
    }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          padding: 16,
          gap: 16,
        }}
        onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, { product: item })}
        activeOpacity={0.7}
      >
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          backgroundColor: '#F8F9FB',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#F1F5F9',
        }}>
          <Text style={{ fontSize: 32 }}>{item.image}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#94A3B8',
              textTransform: 'uppercase',
            }}>{item.category}</Text>
            <View style={[
              { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
              item.status === 'Active' ? { backgroundColor: '#F0FDF4' } :
                item.status === 'Draft' ? { backgroundColor: '#F1F5F9' } : { backgroundColor: '#FEF2F2' }
            ]}>
              <Text style={[
                { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
                item.status === 'Active' ? { color: '#16A34A' } :
                  item.status === 'Draft' ? { color: '#64748B' } : { color: '#EF4444' }
              ]}>{item.status}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 6 }} numberOfLines={1}>{item.name}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#8B5CF6' }}>{item.price}</Text>
            <Text style={[{ fontSize: 12, fontWeight: '600', color: '#64748B' }, item.stock === 0 && { color: '#EF4444' }]}>
              {item.stock} in stock
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        backgroundColor: '#FAFBFC',
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: '#F1F5F9',
          }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product: item })}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
          borderRightWidth: 1,
          borderRightColor: '#F1F5F9',
        }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Hide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View >
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* 1. Header Section */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 20,
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>Inventory</Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2, fontWeight: '500' }}>Manage your products and stock</Text>
        </View>
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#8B5CF6',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen)}
        >
          <Text style={{ color: '#FFF', fontSize: 28, fontWeight: '300' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Search & Filters */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF',
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 48,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          marginBottom: 16,
        }}>
          <Text style={{ marginRight: 10, fontSize: 16 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#111' }}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
                activeTab === tab && { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[{ fontSize: 14, fontWeight: '700', color: '#6B7280' }, activeTab === tab && { color: '#FFF' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>No products found</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Try adjusting your filters or search query</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}