import React, { useState, useEffect } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Switch, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";

const { width } = Dimensions.get('window');

export default function EditCreateProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialProduct = route.params?.product;
  const isEdit = initialProduct !== undefined;

  const [form, setForm] = useState({
    id: initialProduct?.id || null,
    name: initialProduct?.name || '',
    product_category_id: initialProduct?.productCategoryId || null,
    category_name: initialProduct?.category?.code || '',
    offer_type: initialProduct?.offerType || 'Sale',
    unit: initialProduct?.unit || 'piece',
    price: initialProduct?.price?.toString() || '',
    stock: initialProduct?.stock?.toString() || '',
    sku: initialProduct?.sku || '',
    description: initialProduct?.description || '',
    specifications: initialProduct?.specifications ? JSON.stringify(initialProduct.specifications, null, 2) : '',
    isAvailable: initialProduct?.isAvailable ?? true,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCats(true);
      try {
        const response: any = await api.get(ApiRoutes.taxonomies, {
          params: { types: 'product_categories' }
        });
        if (response && response.product_categories) {
          setCategories(response.product_categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const updateForm = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const onSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      Alert.alert("Error", "Please fill in all required fields (Name, Price, Stock)");
      return;
    }

    setIsSaving(true);
    try {
      let specs = null;
      if (form.specifications) {
        try {
          specs = JSON.parse(form.specifications);
        } catch (e) {
          // If not JSON, try to convert a simple key:value per line format
          const lines = form.specifications.split('\n');
          const obj: any = {};
          lines.forEach(line => {
            const [k, v] = line.split(':');
            if (k && v) obj[k.trim()] = v.trim();
          });
          specs = obj;
        }
      }

      const payload = {
        name: form.name,
        product_category_id: form.product_category_id,
        offer_type: form.offer_type,
        unit: form.unit,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        sku: form.sku,
        description: form.description,
        specifications: specs,
        is_available: form.isAvailable,
      };

      if (isEdit) {
        await api.put(buildRoute(ApiRoutes.products.update, { id: form.id }), payload);
        Alert.alert("Success", "Product updated successfully");
      } else {
        await api.post(ApiRoutes.products.store, payload);
        Alert.alert("Success", "Product published successfully");
      }
      navigation.goBack();
    } catch (error: any) {
      console.error("Error saving product:", error);
      const msg = error.response?.data?.message || "Failed to save product";
      Alert.alert("Error", msg);
    } finally {
      setIsSaving(false);
    }
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
        <TouchableOpacity style={{ paddingHorizontal: 12 }} onPress={onSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#8B5CF6" /> : <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 15 }}>Save</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon Preview */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ width: 140, height: 140, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 60 }}>{form.product_category_id === 1 ? '🧪' : '🔬'}</Text>
            </View>
          </View>

          {/* 1. Basic Information */}
          <SectionHeader title='Basic Information' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Product Name *</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                placeholder="e.g. Digital Microscope X1"
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }, form.product_category_id === cat.id && { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }]}
                    onPress={() => updateForm('product_category_id', cat.id)}
                  >
                    <Text style={[{ fontSize: 12, fontWeight: '700', color: '#64748B' }, form.product_category_id === cat.id && { color: '#8B5CF6' }]}>{cat.code}</Text>
                  </TouchableOpacity>
                ))}
                {isLoadingCats && <ActivityIndicator color="#8B5CF6" />}
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Offer Type</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {['Sale', 'Rent', 'Service'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }, form.offer_type === type && { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }]}
                    onPress={() => updateForm('offer_type', type)}
                  >
                    <Text style={[{ fontSize: 13, fontWeight: '700', color: '#64748B' }, form.offer_type === type && { color: '#8B5CF6' }]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ gap: 8, flex: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Price (DA) *</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={(v) => updateForm('price', v)}
                />
              </View>
              <View style={{ gap: 8, flex: 1.5 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Stock *</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.stock}
                  onChangeText={(v) => updateForm('stock', v)}
                />
              </View>
              <View style={{ gap: 8, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Unit</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 10, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 13, fontWeight: '600', color: '#111', textAlign: 'center' }}
                  placeholder="pc"
                  value={form.unit}
                  onChangeText={(v) => updateForm('unit', v)}
                />
              </View>
            </View>
          </View>

          {/* 3. Deep Details */}
          <SectionHeader title='Detailed Specifications' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Specifications (Key: Value)</Text>
              <TextInput
                style={[{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }, { height: 120, paddingTop: 16, textAlignVertical: 'top' }]}
                placeholder="Magnification: 1600X&#10;Resolution: 1080P"
                multiline
                value={form.specifications}
                onChangeText={(v) => updateForm('specifications', v)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Product Description</Text>
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
          <SectionHeader title='Status' />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>Visible to Researchers</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{form.isAvailable ? 'Currently Public' : 'Currently Private'}</Text>
              </View>
              <Switch
                value={form.isAvailable}
                onValueChange={(v) => updateForm('isAvailable', v)}
                trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[{ backgroundColor: '#8B5CF6', height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }, isSaving && { backgroundColor: '#E2E8F0', shadowOpacity: 0 }]}
            onPress={onSave}
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{isEdit ? 'Update Inventory' : 'Publish Product'}</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

