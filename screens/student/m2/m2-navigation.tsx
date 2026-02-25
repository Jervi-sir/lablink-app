import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, Dimensions, FlatList } from "react-native";
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
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* 1. Recent Searches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <TouchableOpacity><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {RECENT_SEARCHES.map(item => (
            <TouchableOpacity key={item} style={styles.chip} onPress={() => setSearch(item)}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. Top Laboratories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Laboratories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.labsScroll}>
          {TRENDING_LABS.map(lab => (
            <TouchableOpacity
              key={lab.id}
              style={styles.labCard}
              onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: lab.name })}
            >
              <View style={styles.labLogoBg}>
                <Text style={styles.labLogo}>{lab.logo}</Text>
              </View>
              <Text style={styles.labName} numberOfLines={1}>{lab.name}</Text>
              <Text style={styles.labCity}>{lab.city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Trending Equipment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Equipment</Text>
        <View style={styles.grid}>
          {SUGGESTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
            >
              <View style={styles.gridImageBg}>
                <Text style={styles.gridEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.gridInfo}>
                <Text style={styles.gridLab}>{item.lab}</Text>
                <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.gridPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        {['Products', 'Laboratories'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={SUGGESTIONS} // Mocked results
        keyExtractor={item => item.id}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
          >
            <View style={styles.resultIconBg}>
              <Text style={{ fontSize: 20 }}>{activeTab === 'Products' ? item.emoji : '🏢'}</Text>
            </View>
            <View style={styles.resultDetails}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultSub}>{item.lab} • {item.price}</Text>
            </View>
            <Text style={{ color: '#CBD5E1' }}>→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Dynamic Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search equipment, labs, chemicals..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? renderResults() : renderDiscovery()}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#FFF' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  closeIcon: { fontSize: 16, color: '#94A3B8', padding: 4 },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  scrollContent: { paddingBottom: 40 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  clearText: { fontSize: 12, fontWeight: '700', color: '#137FEC' },
  chipContainer: { gap: 10 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  chipText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  labsScroll: { gap: 16, paddingRight: 20 },
  labCard: { width: 100, alignItems: 'center', gap: 8 },
  labLogoBg: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  labLogo: { fontSize: 32 },
  labName: { fontSize: 13, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  labCity: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 },
  gridCard: { width: COLUMN_WIDTH, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  gridImageBg: { height: 120, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  gridEmoji: { fontSize: 40 },
  gridInfo: { padding: 12, gap: 4 },
  gridLab: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  gridName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  gridPrice: { fontSize: 14, fontWeight: '800', color: '#137FEC' },
  resultsContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  tabBar: { flexDirection: 'row', padding: 16, gap: 12 },
  tab: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  activeTab: { backgroundColor: '#137FEC', borderColor: '#137FEC' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  resultsList: { padding: 16 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  resultIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  resultDetails: { flex: 1, marginLeft: 16 },
  resultName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  resultSub: { fontSize: 13, color: '#94A3B8', marginTop: 2 }
});