import React, { useState } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Switch } from "react-native";
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

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={{ marginBottom: 12, marginTop: 12, marginLeft: 4 }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</Text>
        <TouchableOpacity style={{ paddingHorizontal: 12 }} onPress={onSave}>
          <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 15 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>

          {/* Visual Picker */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <TouchableOpacity style={{ width: 140, height: 140, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 60 }}>{form.image}</Text>
              <View style={{ position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F8F9FB' }}>
                <Text style={{ fontSize: 12 }}>📸</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 12 }}>Tap to change imagery</Text>
          </View>

          {/* 1. Basic Information */}
          <SectionHeader title='Basic Information' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Product Name</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                placeholder="e.g. Digital Microscope X1"
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Category</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                placeholder="e.g. Optical Equipment"
                value={form.category}
                onChangeText={(v) => updateForm('category', v)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>SKU / Catalog Number</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                placeholder="e.g. NB-500-D"
                value={form.sku}
                onChangeText={(v) => updateForm('sku', v)}
              />
            </View>
          </View>

          {/* 2. Inventory & Pricing */}
          <SectionHeader title='Inventory & Pricing' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ gap: 8, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Price (DA)</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.price.toString()}
                  onChangeText={(v) => updateForm('price', v)}
                />
              </View>
              <View style={{ gap: 8, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>In Stock</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.stock.toString()}
                  onChangeText={(v) => updateForm('stock', v)}
                />
              </View>
            </View>
          </View>

          {/* 3. Deep Details */}
          <SectionHeader title='Detailed Specifications' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Specifications (Points)</Text>
              <TextInput
                style={[{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }, { height: 100, paddingTop: 16, textAlignVertical: 'top' }]}
                placeholder="e.g. Magnification: 1600X\nSensor: 12MP..."
                multiline
                value={form.specs}
                onChangeText={(v) => updateForm('specs', v)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Marketing Description</Text>
              <TextInput
                style={[{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }, { height: 100, paddingTop: 16, textAlignVertical: 'top' }]}
                placeholder="Tell researchers why they need this..."
                multiline
                value={form.description}
                onChangeText={(v) => updateForm('description', v)}
              />
            </View>
          </View>

          {/* 4. Advanced Options */}
          <SectionHeader title='Advanced Settings' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>Safety Data (MSDS)</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>Include safety documentation</Text>
              </View>
              <Switch
                value={form.hasMSDS}
                onValueChange={(v) => updateForm('hasMSDS', v)}
                trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Listing Status</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                {['Active', 'Draft', 'Hidden'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }, form.status === s && { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }]}
                    onPress={() => updateForm('status', s)}
                  >
                    <Text style={[{ fontSize: 13, fontWeight: '700', color: '#64748B' }, form.status === s && { color: '#8B5CF6' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity style={{ backgroundColor: '#8B5CF6', height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }} onPress={onSave}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{isEdit ? 'Update Inventory' : 'Publish Product'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

