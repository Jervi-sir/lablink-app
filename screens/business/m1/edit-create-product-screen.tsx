import React, { useState, useEffect } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Switch, ActivityIndicator, Alert, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute, BASE_URL } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/zustand/auth-store";
import { SheetManager } from "react-native-actions-sheet";
import { useInventoryStore } from "../zustand/inventory-store";
import { useLanguageStore } from "@/zustand/language-store";



const { width } = Dimensions.get('window');

const translations = {
  edit_product: { en: 'Edit Product', fr: 'Modifier le produit', ar: 'تعديل المنتج' },
  add_new_product: { en: 'Add New Product', fr: 'Ajouter un nouveau produit', ar: 'إضافة منتج جديد' },
  save: { en: 'Save', fr: 'Enregistrer', ar: 'حفظ' },
  limit_reached: { en: 'Limit Reached', fr: 'Limite atteinte', ar: 'تم الوصول إلى الحد الأقصى' },
  upload_limit_msg: { en: 'You can upload up to 10 images per product.', fr: 'Vous pouvez télécharger jusqu\'à 10 images par produit.', ar: 'يمكنك تحميل ما يصل إلى 10 صور لكل منتج.' },
  permission_denied: { en: 'Permission Denied', fr: 'Permission refusée', ar: 'تم رفض الإذن' },
  camera_permission_msg: { en: 'Camera permission is required to take photos.', fr: 'La permission de l\'appareil photo est requise pour prendre des photos.', ar: 'مطلوب إذن الكاميرا لالتقاط الصور.' },
  remove_image: { en: 'Remove Image', fr: 'Supprimer l\'image', ar: 'إزالة الصورة' },
  delete_image_msg: { en: 'Delete this image?', fr: 'Supprimer cette image ?', ar: 'هل تريد حذف هذه الصورة؟' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  delete: { en: 'Delete', fr: 'Supprimer', ar: 'حذف' },
  error: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  upload_warning: { en: 'Product saved, but some images failed to upload.', fr: 'Produit enregistré, mais certaines images n\'ont pas pu être téléchargées.', ar: 'تم حفظ المنتج ، ولكن فشل تحميل بعض الصور.' },
  success: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  product_updated: { en: 'Product updated successfully', fr: 'Produit mis à jour avec succès', ar: 'تم تحديث المنتج بنجاح' },
  product_published: { en: 'Product published successfully', fr: 'Produit publié avec succès', ar: 'تم نشر المنتج بنجاح' },
  failed_save: { en: 'Failed to save product', fr: 'Échec de l\'enregistrement du produit', ar: 'فشل في حفظ المنتج' },
  product_images: { en: 'Product Images', fr: 'Images du produit', ar: 'صور المنتج' },
  add_more_photos: { en: 'Add More Photos', fr: 'Ajouter plus de photos', ar: 'إضافة المزيد من الصور' },
  upload_photos: { en: 'Upload Product Photos', fr: 'Télécharger des photos du produit', ar: 'تحميل صور المنتج' },
  size_limit_msg: { en: '{count}/10 • JPG, PNG, WebP up to 5MB', fr: '{count}/10 • JPG, PNG, WebP jusqu\'à 5 Mo', ar: '{count}/10 • JPG، PNG، WebP حتى 5 ميجابايت' },
  uploading_images: { en: 'Uploading images...', fr: 'Téléchargement des images...', ar: 'جاري تحميل الصور...' },
  product: { en: 'Product', fr: 'Produit', ar: 'منتج' },
  service: { en: 'Service', fr: 'Service', ar: 'خدمة' },
  basic_info: { en: 'Basic Information', fr: 'Informations de base', ar: 'معلومات أساسية' },
  service_name: { en: 'Service Name', fr: 'Nom du service', ar: 'اسم الخدمة' },
  product_name: { en: 'Product Name', fr: 'Nom du produit', ar: 'اسم المنتج' },
  service_placeholder: { en: 'e.g. DNA Sequencing Analysis', fr: 'ex : Analyse de séquençage d\'ADN', ar: 'مثلاً: تحليل تسلسل الحمض النووي' },
  product_placeholder: { en: 'e.g. Digital Microscope X1', fr: 'ex : Microscope numérique X1', ar: 'مثلاً: مجهر رقمي X1' },
  category: { en: 'Category', fr: 'Catégorie', ar: 'الفئة' },
  offer_type: { en: 'Offer Type', fr: 'Type d\'offre', ar: 'نوع العرض' },
  sku_label: { en: 'SKU / Catalog Number', fr: 'SKU / Numéro de catalogue', ar: 'وحدة حفظ المخزون / رقم الكتالوج' },
  sku_placeholder: { en: 'e.g. NB-500-D', fr: 'ex : NB-500-D', ar: 'مثلاً: NB-500-D' },
  failed_delete_product: { en: 'Failed to delete image.', fr: 'Échec de la suppression de l\'image.', ar: 'فشل في حذف الصورة.' },
  inventory_pricing: { en: 'Inventory & Pricing', fr: 'Inventaire et tarifs', ar: 'المخزون والتسعير' },
  pricing: { en: 'Pricing', fr: 'Tarification', ar: 'التسعير' },
  price_da: { en: 'Price (DA) *', fr: 'Prix (DA) *', ar: 'السعر (دج) *' },
  stock: { en: 'Stock *', fr: 'Stock *', ar: 'المخزون *' },
  unit: { en: 'Unit', fr: 'Unité', ar: 'الوحدة' },
  session_suffix: { en: ' / session', fr: ' / session', ar: ' / جلسة' },
  day_suffix: { en: ' / day', fr: ' / jour', ar: ' / يوم' },
  piece_suffix: { en: ' / {unit}', fr: ' / {unit}', ar: ' / {unit}' },
  pricing_model: { en: 'Pricing Model', fr: 'Modèle de tarification', ar: 'نموذج التسعير' },
  detailed_specs: { en: 'Detailed Specifications', fr: 'Spécifications détaillées', ar: 'المواصفات التفصيلية' },
  specs_label: { en: 'Specifications (Key: Value)', fr: 'Spécifications (Clé: Valeur)', ar: 'المواصفات (المفتاح: القيمة)' },
  service_details_label: { en: 'Service Details (Key: Value)', fr: 'Détails du service (Clé: Valeur)', ar: 'تفاصيل الخدمة (المفتاح: القيمة)' },
  service_desc_label: { en: 'Service Description', fr: 'Description du service', ar: 'وصف الخدمة' },
  product_desc_label: { en: 'Product Description', fr: 'Description du produit', ar: 'وصف المنتج' },
  status: { en: 'Status', fr: 'Statut', ar: 'الحالة' },
  visible_to_researchers: { en: 'Visible to Researchers', fr: 'Visible pour les chercheurs', ar: 'مرئي للباحثين' },
  currently_public: { en: 'Currently Public', fr: 'Actuellement public', ar: 'عام حالياً' },
  currently_private: { en: 'Currently Private', fr: 'Actuellement privé', ar: 'خاص حالياً' },
  update_inventory: { en: 'Update Inventory', fr: 'Mettre à jour l\'inventaire', ar: 'تحديث المخزون' },
  publish_service: { en: 'Publish Service', fr: 'Publier le service', ar: 'نشر الخدمة' },
  publish_product: { en: 'Publish Product', fr: 'Publier le produit', ar: 'نشر المنتج' },
  provide_name_error: { en: 'Please provide a product name.', fr: 'Veuillez fournir un nom de produit.', ar: 'يرجى تقديم اسم المنتج.' },
  valid_price_product_error: { en: 'Please enter a valid price for the product.', fr: 'Veuillez entrer un prix valide pour le produit.', ar: 'يرجى إدخال سعر صالح للمنتج.' },
  valid_price_service_error: { en: 'Please enter a valid price for the service.', fr: 'Veuillez entrer un prix valide pour le service.', ar: 'يرجى إدخال سعر صالح للخدمة.' },
  valid_stock_error: { en: 'Please enter a valid stock quantity.', fr: 'Veuillez entrer une quantité de stock valide.', ar: 'يرجى إدخال كمية مخزون صالحة.' },
};

export default function EditCreateProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations, params?: Record<string, string>) => {
    let text = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };
  const initialProduct = route.params?.product;
  const isEdit = initialProduct !== undefined;
  const { auth } = useAuthStore();
  const { addProductLocal, updateProductLocal } = useInventoryStore();


  const [form, setForm] = useState({
    id: initialProduct?.id || null,
    name: initialProduct?.name || '',
    product_category_id: initialProduct?.productCategoryId || null,
    category_name: initialProduct?.category?.code || '',
    product_type: initialProduct?.productType || 'product', // 'product' or 'service'
    offer_type: initialProduct?.offerType || 'Sale',
    unit: initialProduct?.unit || 'piece',
    price: initialProduct?.price?.toString() || '',
    stock: initialProduct?.stock?.toString() || '',
    sku: initialProduct?.sku || '',
    description: initialProduct?.description || '',
    specifications: initialProduct?.specifications ? JSON.stringify(initialProduct.specifications, null, 2) : '',
    isAvailable: initialProduct?.isAvailable ?? true,
  });

  // Images state
  const [existingImages, setExistingImages] = useState<any[]>(initialProduct?.images || []);
  const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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

  // Format price input — allows numeric with decimal
  const handlePriceChange = (text: string) => {
    // Remove non-numeric characters except decimal point
    let cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }
    updateForm('price', cleaned);
  };

  const handleStockChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    updateForm('stock', cleaned);
  };

  // Image picker
  const pickImages = async () => {
    const totalImages = existingImages.length + newImages.length;
    if (totalImages >= 10) {
      Alert.alert(t('limit_reached'), t('upload_limit_msg'));
      return;
    }

    const remaining = 10 - totalImages;
    const isLaboratory = auth?.businessProfile?.category?.code?.toLowerCase() === 'laboratory';

    const handleLibraryPick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets) {
        setNewImages(prev => [...prev, ...result.assets]);
      }
    };

    const handleCameraPick = async () => {
      // Permission request
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_denied'), t('camera_permission_msg'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets) {
        setNewImages(prev => [...prev, ...result.assets]);
      }
    };

    if (isLaboratory) {
      await handleCameraPick();
    } else {
      SheetManager.show('image-picker-sheet', {
        payload: {
          onSelect: async (option) => {
            if (option === 'camera') {
              await handleCameraPick();
              SheetManager.hide('image-picker-sheet');
            } else {
              await handleLibraryPick();
              SheetManager.hide('image-picker-sheet');
            }
          }
        }
      });
    }
  };


  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: number) => {
    try {
      await api.delete(buildRoute(ApiRoutes.products.deleteImage, { id: imageId }));
      setExistingImages(prev => prev.filter((img: any) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert(t('error'), t('failed_save'));
    }
  };

  const uploadImages = async (productId: number) => {
    if (newImages.length === 0) return;

    setIsUploadingImages(true);
    try {
      const formData = new FormData();
      newImages.forEach((image, index) => {
        const uri = image.uri;
        const filename = uri.split('/').pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('images[]', {
          uri,
          name: filename,
          type,
        } as any);
      });

      await api.post(
        buildRoute(ApiRoutes.products.uploadImages, { id: productId }),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert(t('error'), t('upload_warning'));
    } finally {
      setIsUploadingImages(false);
    }
  };

  const onSave = async () => {
    if (!form.name) {
      Alert.alert(t('error'), t('provide_name_error'));
      return;
    }

    // Validate pricing based on type
    if (form.product_type === 'product') {
      if (!form.price || parseFloat(form.price) <= 0) {
        Alert.alert(t('error'), t('valid_price_product_error'));
        return;
      }
      if (!form.stock || parseInt(form.stock) < 0) {
        Alert.alert(t('error'), t('valid_stock_error'));
        return;
      }
    } else {
      // Service — price is required but stock not needed
      if (!form.price || parseFloat(form.price) <= 0) {
        Alert.alert(t('error'), t('valid_price_service_error'));
        return;
      }
    }

    setIsSaving(true);
    try {
      let specs = null;
      if (form.specifications) {
        try {
          specs = JSON.parse(form.specifications);
        } catch (e) {
          const lines = form.specifications.split('\n');
          const obj: any = {};
          lines.forEach(line => {
            const [k, v] = line.split(':');
            if (k && v) obj[k.trim()] = v.trim();
          });
          specs = obj;
        }
      }

      const payload: any = {
        name: form.name,
        product_type: form.product_type,
        product_category_id: form.product_category_id,
        offer_type: form.offer_type,
        unit: form.unit,
        price: parseFloat(form.price),
        stock: form.product_type === 'service' ? 999 : parseInt(form.stock || '0'),
        sku: form.sku,
        description: form.description,
        specifications: specs,
        is_available: form.isAvailable,
      };

      let productId = form.id;

      if (isEdit) {
        await api.put(buildRoute(ApiRoutes.products.update, { id: form.id }), payload);
        updateProductLocal(form.id, {
          ...payload,
          isAvailable: payload.is_available,
          images: existingImages // Keeping existing ones, new ones will be added after refresh or manual push
        });
      } else {
        const response: any = await api.post(ApiRoutes.products.store, payload);
        productId = response.data?.id;
        if (response.data) {
          addProductLocal({
            ...response.data,
            isAvailable: response.data.is_available ?? payload.is_available
          });
        }
      }

      // Upload new images
      if (productId && newImages.length > 0) {
        await uploadImages(productId);
      }

      Alert.alert(t('success'), isEdit ? t('product_updated') : t('product_published'));
      navigation.goBack();
    } catch (error: any) {
      console.error("Error saving product:", error);
      const msg = error.response?.data?.message || t('failed_save');
      Alert.alert(t('error'), msg);
    } finally {
      setIsSaving(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={{ marginBottom: 12, marginTop: 12, marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
    </View>
  );

  const isService = form.product_type === 'service';

  const allImages = [
    ...existingImages.map((img: any) => ({ type: 'existing' as const, ...img })),
    ...newImages.map((img, index) => ({ type: 'new' as const, uri: img.uri, index })),
  ];

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{
        height: 60,
        flexDirection: language === 'ar' ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: paddingHorizontal,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{isEdit ? t('edit_product') : t('add_new_product')}</Text>
        <TouchableOpacity style={{ paddingHorizontal: 12 }} onPress={onSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#8B5CF6" /> : <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 15 }}>{t('save')}</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingHorizontal: paddingHorizontal }}
          keyboardShouldPersistTaps="handled"
        >

          {/* Image Upload Section */}
          <SectionHeader title={t('product_images')} />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[ { gap: 12 }, language === 'ar' && { flexDirection: 'row-reverse' } ]}>
                {allImages.map((img, idx) => (
                  <View key={`img-${idx}`} style={{ position: 'relative', paddingTop: 10 }}>
                    <Image
                      source={{ uri: img.type === 'existing' ? img.url : img.uri }}
                      style={{ width: 110, height: 110, borderRadius: 16, backgroundColor: '#F1F5F9' }}
                    />
                    {/* Main badge */}
                    {img.type === 'existing' && img.isMain && (
                      <View style={{ position: 'absolute', bottom: 6, left: language === 'ar' ? undefined : 6, right: language === 'ar' ? 6 : undefined, backgroundColor: '#8B5CF6', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFF' }}>MAIN</Text>
                      </View>
                    )}
                    {/* Delete button */}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 0, right: language === 'ar' ? undefined : -6, left: language === 'ar' ? -6 : undefined, width: 26, height: 26, borderRadius: 13, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' }}
                      onPress={() => {
                        if (img.type === 'existing') {
                          Alert.alert(t('remove_image'), t('delete_image_msg'), [
                            { text: t('cancel'), style: "cancel" },
                            { text: t('delete'), style: "destructive", onPress: () => removeExistingImage(img.id) },
                          ]);
                        } else {
                          removeNewImage(img.index);
                        }
                      }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '800', marginTop: -1 }}>×</Text>
                    </TouchableOpacity>
                    {/* New badge */}
                    {img.type === 'new' && (
                      <View style={{ position: 'absolute', bottom: 6, left: language === 'ar' ? undefined : 6, right: language === 'ar' ? 6 : undefined, backgroundColor: '#10B981', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFF' }}>NEW</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Upload Button */}
            <TouchableOpacity
              style={{
                height: allImages.length > 0 ? 60 : 140,
                borderWidth: 2,
                borderColor: '#E2E8F0',
                borderStyle: 'dashed',
                borderRadius: 16,
                backgroundColor: '#F8FAFC',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: language === 'ar' ? 'row-reverse' : (allImages.length > 0 ? 'row' : 'column'),
                gap: 8,
              }}
              onPress={pickImages}
            >
              <View style={{ width: allImages.length > 0 ? 32 : 44, height: allImages.length > 0 ? 32 : 44, backgroundColor: '#EEF2FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: allImages.length > 0 ? 16 : 24 }}>📷</Text>
              </View>
              <View style={{ alignItems: language === 'ar' ? 'flex-end' : (allImages.length > 0 ? 'flex-start' : 'center') }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#8B5CF6' }}>
                  {allImages.length > 0 ? t('add_more_photos') : t('upload_photos')}
                </Text>
                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  {t('size_limit_msg', { count: allImages.length.toString() })}
                </Text>
              </View>
            </TouchableOpacity>

            {isUploadingImages && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text style={{ fontSize: 12, color: '#8B5CF6', fontWeight: '600' }}>Uploading images...</Text>
              </View>
            )}
          </View>
          {/* Product / Service Type Toggle */}
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 4 }}>
              {(['product', 'service'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
                    form.product_type === type && { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
                  ]}
                  onPress={() => updateForm('product_type', type)}
                >
                  <Text style={{ fontSize: 14 }}>{type === 'product' ? '📦' : '🔧'}</Text>
                  <Text style={[
                    { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginTop: 2 },
                    form.product_type === type && { color: '#8B5CF6' },
                  ]}>{type === 'product' ? t('product') : t('service')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 1. Basic Information */}
          <SectionHeader title={t('basic_info')} />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{isService ? t('service_name') : t('product_name')} *</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111', width: '100%', textAlign: language === 'ar' ? 'right' : 'left' }}
                placeholder={isService ? t('service_placeholder') : t('product_placeholder')}
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
              />
            </View>
            <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('category')}</Text>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
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
            {!isService && (
              <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('offer_type')}</Text>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 10, width: '100%' }}>
                  {['Sale', 'Rent'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }, form.offer_type === type && { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' }]}
                      onPress={() => updateForm('offer_type', type)}
                    >
                      <Text style={[{ fontSize: 13, fontWeight: '700', color: '#64748B' }, form.offer_type === type && { color: '#8B5CF6' }]}>{type === 'Sale' ? (language === 'ar' ? 'بيع' : (language === 'fr' ? 'Vente' : 'Sale')) : (language === 'ar' ? 'تأجير' : (language === 'fr' ? 'Location' : 'Rent'))}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {!isService && (
              <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('sku_label')}</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111', width: '100%', textAlign: language === 'ar' ? 'right' : 'left' }}
                  placeholder={t('sku_placeholder')}
                  value={form.sku}
                  onChangeText={(v) => updateForm('sku', v)}
                />
              </View>
            )}
          </View>

          {/* 2. Pricing */}
          <SectionHeader title={isService ? t('pricing') : t('inventory_pricing')} />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <View style={{ gap: 8, width: '100%' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>
                  {t('price_da')}
                </Text>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 4 }}>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 14, borderRightWidth: language === 'ar' ? 0 : 1, borderLeftWidth: language === 'ar' ? 1 : 0, borderColor: '#E2E8F0' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#8B5CF6' }}>DA</Text>
                  </View>
                  <TextInput
                    style={{ flex: 1, paddingHorizontal: 12, height: 52, fontSize: 15, fontWeight: '600', color: '#111', textAlign: language === 'ar' ? 'right' : 'left' }}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={form.price}
                    onChangeText={handlePriceChange}
                  />
                </View>
                {!isService && (
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8 }}>
                    <View style={{ gap: 8, flex: 1.5, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('stock')}</Text>
                      <TextInput
                        style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111', width: '100%', textAlign: language === 'ar' ? 'right' : 'left' }}
                        placeholder="0"
                        keyboardType="numeric"
                        value={form.stock}
                        onChangeText={handleStockChange}
                      />
                    </View>
                    <View style={{ gap: 8, flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('unit')}</Text>
                      <TextInput
                        style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 10, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 13, fontWeight: '600', color: '#111', textAlign: 'center', width: '100%' }}
                        placeholder="pc"
                        value={form.unit}
                        onChangeText={(v) => updateForm('unit', v)}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={{ paddingTop: 8, width: '100%' }}>
                {form.price ? (
                  <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center' }}>
                    {parseFloat(form.price).toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
                    {isService ? t('session_suffix') : form.offer_type === 'Rent' ? t('day_suffix') : t('piece_suffix', { unit: form.unit || 'piece' })}
                  </Text>
                ) : null}
              </View>
            </View>

            {isService && (
              <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>{t('pricing_model')}</Text>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 10, width: '100%' }}>
                  {['Per Session', 'Per Hour', 'Fixed'].map((model) => {
                    const unitMap: any = { 'Per Session': 'session', 'Per Hour': 'hour', 'Fixed': 'fixed' };
                    const modelTrans: any = {
                      'Per Session': language === 'ar' ? 'لكل جلسة' : (language === 'fr' ? 'Par session' : 'Per Session'),
                      'Per Hour': language === 'ar' ? 'لكل ساعة' : (language === 'fr' ? 'Par heure' : 'Per Hour'),
                      'Fixed': language === 'ar' ? 'ثابت' : (language === 'fr' ? 'Fixe' : 'Fixed')
                    };
                    return (
                      <TouchableOpacity
                        key={model}
                        style={[
                          { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
                          form.unit === unitMap[model] && { backgroundColor: '#F5F3FF', borderColor: '#8B5CF6' },
                        ]}
                        onPress={() => updateForm('unit', unitMap[model])}
                      >
                        <Text style={[{ fontSize: 12, fontWeight: '700', color: '#64748B' }, form.unit === unitMap[model] && { color: '#8B5CF6' }]}>{modelTrans[model]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* 3. Deep Details */}
          <SectionHeader title={t('detailed_specs')} />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>
                {isService ? t('service_details_label') : t('specs_label')}
              </Text>
              <TextInput
                style={[{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111', width: '100%', textAlign: language === 'ar' ? 'right' : 'left' }, { height: 120, paddingTop: 16, textAlignVertical: 'top' }]}
                placeholder={isService ? "Duration: 2 hours\nTurnaround: 3 days" : "Magnification: 1600X\nResolution: 1080P"}
                multiline
                value={form.specifications}
                onChangeText={(v) => updateForm('specifications', v)}
              />
            </View>
            <View style={{ gap: 8, width: '100%', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0 }}>
                {isService ? t('service_desc_label') : t('product_desc_label')}
              </Text>
              <TextInput
                style={[{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111', width: '100%', textAlign: language === 'ar' ? 'right' : 'left' }, { height: 100, paddingTop: 16, textAlignVertical: 'top' }]}
                placeholder={isService ? "Describe the service you offer..." : "Tell researchers why they need this..."}
                multiline
                value={form.description}
                onChangeText={(v) => updateForm('description', v)}
              />
            </View>
          </View>

          {/* 4. Advanced Options */}
          <SectionHeader title={t('status')} />
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, gap: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>{t('visible_to_researchers')}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{form.isAvailable ? t('currently_public') : t('currently_private')}</Text>
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
            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{isEdit ? t('update_inventory') : (isService ? t('publish_service') : t('publish_product'))}</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
