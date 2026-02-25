import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const RECENT_SEARCHES = ['Microscope', 'Beakers', 'USTHB', 'Centrifuge', 'Chemicals'];
const TRENDING_LABS = [
  { id: '1', name: 'Bio-Research', logo: '🧬', city: 'Algiers' },
  { id: '2', name: 'NanoTech', logo: '🔬', city: 'Oran' },
  { id: '3', name: 'ChemLab', logo: '🧪', city: 'Constantine' },
  { id: '4', name: 'Genomics Hub', logo: '🧬', city: 'Batna' },
];

const SUGGESTIONS = [
  { id: '1', name: 'Precision Balance', lab: 'NanoTech', price: '32,000 DA', emoji: '⚖️' },
  { id: '2', name: 'PCR Kit', lab: 'Bio-Research', price: '15,000 DA', emoji: '🧪' },
  { id: '3', name: 'Safety Goggles', lab: 'ChemLab', price: '800 DA', emoji: '🥽' },
  { id: '4', name: 'Lab Coat (M/L)', lab: 'University Supply', price: '2,500 DA', emoji: '🥼' },
];

export default function StudentM2Navigation() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Products');

  const isSearching = search.length > 0;

  const renderDiscovery = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 1. Recent Searches */}
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Searches</Text>
          <TouchableOpacity><Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>Clear</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {RECENT_SEARCHES.map(item => (
            <TouchableOpacity key={item} style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }} onPress={() => setSearch(item)}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. Top Laboratories */}
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Top Laboratories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
          {TRENDING_LABS.map(lab => (
            <TouchableOpacity
              key={lab.id}
              style={{ width: 100, alignItems: 'center', gap: 8 }}
              onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: lab.name })}
            >
              <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
                <Text style={{ fontSize: 32 }}>{lab.logo}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#1E293B', textAlign: 'center' }} numberOfLines={1}>{lab.name}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#94A3B8' }}>{lab.city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Trending Equipment */}
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Trending Equipment</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
          {SUGGESTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={{ width: COLUMN_WIDTH, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' }}
              onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
            >
              <View style={{ height: 120, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
              </View>
              <View style={{ padding: 12, gap: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{item.lab}</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B' }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC' }}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderResults = () => (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Tab Switcher */}
      <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
        {['Products', 'Laboratories'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
              activeTab === tab && { backgroundColor: '#137FEC', borderColor: '#137FEC' }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[{ fontSize: 14, fontWeight: '700', color: '#64748B' }, activeTab === tab && { color: '#FFF' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={SUGGESTIONS} // Mocked results
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}
            onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{activeTab === 'Products' ? item.emoji : '🏢'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{item.name}</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{item.lab} • {item.price}</Text>
            </View>
            <Text style={{ color: '#CBD5E1' }}>→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Dynamic Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' }}
            placeholder="Search equipment, labs, chemicals..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 16, color: '#94A3B8', padding: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? renderResults() : renderDiscovery()}
    </ScreenWrapper>
  );
}