import React, { useState } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

export default function EditCreateProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isEdit = route.params?.product !== undefined;

  const [form, setForm] = useState(route.params?.product || {
    name: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    description: '',
    specs: '',
    hasMSDS: false,
    image: '🧪',
    status: 'Active'
  });

  const updateForm = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const onSave = () => {
    console.log("Saving product:", form);
    navigation.goBack();
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Product' : 'Add New Product'}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Visual Picker */}
          <View style={styles.visualPicker}>
            <TouchableOpacity style={styles.imageStage}>
              <Text style={styles.imageEmoji}>{form.image}</Text>
              <View style={styles.cameraBadge}>
                <Text style={{ fontSize: 12 }}>📸</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.visualHelper}>Tap to change imagery</Text>
          </View>

          {/* 1. Basic Information */}
          {renderSectionHeader('Basic Information')}
          <View style={styles.formSection}>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Digital Microscope X1"
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Optical Equipment"
                value={form.category}
                onChangeText={(v) => updateForm('category', v)}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>SKU / Catalog Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. NB-500-D"
                value={form.sku}
                onChangeText={(v) => updateForm('sku', v)}
              />
            </View>
          </View>

          {/* 2. Inventory & Pricing */}
          {renderSectionHeader('Inventory & Pricing')}
          <View style={styles.formSection}>
            <View style={styles.row}>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.label}>Price (DA)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.price.toString()}
                  onChangeText={(v) => updateForm('price', v)}
                />
              </View>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <Text style={styles.label}>In Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.stock.toString()}
                  onChangeText={(v) => updateForm('stock', v)}
                />
              </View>
            </View>
          </View>

          {/* 3. Deep Details */}
          {renderSectionHeader('Detailed Specifications')}
          <View style={styles.formSection}>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Specifications (Points)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Magnification: 1600X\nSensor: 12MP..."
                multiline
                value={form.specs}
                onChangeText={(v) => updateForm('specs', v)}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Marketing Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell researchers why they need this..."
                multiline
                value={form.description}
                onChangeText={(v) => updateForm('description', v)}
              />
            </View>
          </View>

          {/* 4. Advanced Options */}
          {renderSectionHeader('Advanced Settings')}
          <View style={styles.formSection}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleTitle}>Safety Data (MSDS)</Text>
                <Text style={styles.toggleSub}>Include safety documentation</Text>
              </View>
              <Switch
                value={form.hasMSDS}
                onValueChange={(v) => updateForm('hasMSDS', v)}
                trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.label}>Listing Status</Text>
              <View style={styles.statusChips}>
                {['Active', 'Draft', 'Hidden'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, form.status === s && styles.chipActive]}
                    onPress={() => updateForm('status', s)}
                  >
                    <Text style={[styles.chipText, form.status === s && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={onSave}>
            <Text style={styles.submitBtnText}>{isEdit ? 'Update Inventory' : 'Publish Product'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  saveBtn: { paddingHorizontal: 12 },
  saveBtnText: { color: '#8B5CF6', fontWeight: '800', fontSize: 15 },
  scrollContent: { padding: 20 },
  visualPicker: { alignItems: 'center', marginBottom: 32 },
  imageStage: { width: 140, height: 140, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#E2E8F0' },
  imageEmoji: { fontSize: 60 },
  cameraBadge: { position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F8F9FB' },
  visualHelper: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 12 },
  sectionHeader: { marginBottom: 12, marginTop: 12, marginLeft: 4 },
  sectionHeaderText: { fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  formSection: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  inputWrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' },
  textArea: { height: 100, paddingTop: 16, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 16 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  toggleSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  statusChips: { flexDirection: 'row', gap: 10, marginTop: 4 },
  chip: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  chipActive: { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#8B5CF6' },
  submitBtn: { backgroundColor: '#8B5CF6', height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
