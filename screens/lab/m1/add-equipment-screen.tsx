import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '@/utils/routes';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';
import {
  Plus,
  Image as ImageIcon,
  Clock,
  MapPin,
  User,
  FileText,
  Check,
  X,
  Package,
  ArrowLeft,
} from 'lucide-react-native';

interface NewEquipment {
  name: string;
  description: string;
  image: string;
  specifications: { label: string; value: string }[];
  isAvailable: boolean;
  location: string;
  supervisor: string;
  workingHours: string;
  minBookingTime: string;
}

interface AddEquipmentScreenProps {
}

const inputClassName = "w-full px-4 py-4 rounded-2xl border-2 border-slate-200 bg-white text-right text-base text-slate-800";
const labelClassName = "mb-2 text-right text-sm font-semibold text-slate-700 flex-row items-center gap-2";

export function AddEquipmentScreen({ }: AddEquipmentScreenProps) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productId } = route.params || {};
  const isEditing = !!productId;
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'equipment' | 'service'>('equipment');
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [location, setLocation] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [workingHours, setWorkingHours] = useState('09:00 - 18:00');
  const [minBookingTime, setMinBookingTime] = useState('3 ساعات');
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([
    { label: '', value: '' }
  ]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing) {
      fetchProductForEdit();
    }
  }, [productId]);

  const fetchProductForEdit = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`${ApiRoutes.products.index}/${productId}`);
      if (response.status === 'success') {
        const p = response.data;
        setName(p.name_ar);
        setDescription(p.description_ar);
        setType(p.type);
        setIsAvailable(p.is_available);
        setLocation(p.location);
        setSupervisor(p.supervisor);
        setWorkingHours(p.working_hours);
        setMinBookingTime(p.min_booking_time);
        setSpecifications(p.specifications || [{ label: '', value: '' }]);
        setExistingImages(p.images || []);
      }
    } catch (error) {
      console.error('Error fetching product for edit:', error);
      Alert.alert('خطأ', 'تعذر تحميل بيانات المنتج للتحرير');
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    if (images.length >= 3) {
      Alert.alert('تنبيه', 'يمكنك إضافة 3 صور كحد أقصى');
      return;
    }
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('تنبيه', 'نحتاج إلى إذن الوصول للكاميرا لالتقاط الصور');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleSave = async () => {
    if (!name || !description || !location || !supervisor) {
      Alert.alert('تنبيه', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images
      const mediaIds: number[] = [];
      const imageUrls: string[] = [];
      for (const img of images) {
        // Resize image to ensure it's under 2MB (PHP limit)
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          img.uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );

        const formData = new FormData();
        formData.append('file', {
          uri: manipulatedImage.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        const uploadRes: any = await api.post(ApiRoutes.uploads.temp, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadRes.status === 'success') {
          mediaIds.push(uploadRes.data.id);
          imageUrls.push(uploadRes.data.url);
        }
      }

      // 2. Save Product
      const payload = {
        name_ar: name,
        description_ar: description,
        image_url: imageUrls.length > 0 ? imageUrls[0] : (existingImages.length > 0 ? existingImages[0] : null),
        images: [...existingImages, ...imageUrls],
        specifications: specifications.filter(spec => spec.label && spec.value),
        is_available: isAvailable,
        location,
        supervisor,
        working_hours: workingHours,
        min_booking_time: minBookingTime,
        type,
        media_ids: mediaIds,
      };

      let response: any;
      if (isEditing) {
        response = await api.post(`${ApiRoutes.products.index}/${productId}`, {
          ...payload,
          _method: 'PUT',
        });
      } else {
        response = await api.post(ApiRoutes.products.store, payload);
      }

      if (response.status === 'success') {
        Alert.alert('نجاح', isEditing ? 'تم تحديث البيانات بنجاح' : `تمت إضافة ${type === 'equipment' ? 'الجهاز' : 'الخدمة'} بنجاح`);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-teal-600 px-6 pb-6 pt-12 shadow-lg">
        <Pressable
          onPress={() => {
            navigation.goBack()
          }}
          className="mb-4 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2"
        >
          <ArrowLeft size={24} color="white" />
          <Text className="text-base font-bold text-white">رجوع</Text>
        </Pressable>
        <Text className="text-right text-3xl font-black text-white">
          {isEditing ? 'تعديل البيانات' : (type === 'equipment' ? 'إضافة جهاز' : 'إضافة خدمة')}
        </Text>
        <Text className="mt-1 text-right text-sm text-teal-100">
          {isEditing ? 'تحديث معلومات المنتج أو الخدمة' : (type === 'equipment' ? 'أضف جهازاً جديداً إلى قائمة المعدات' : 'أضف خدمة جديدة إلى قائمة خدماتك')}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-40"
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selection */}
        <View className="mb-8">
          <Text className="mb-3 text-right text-sm font-semibold text-slate-700">نوع الإضافة</Text>
          <View className="flex-row-reverse gap-3">
            <Pressable
              onPress={() => setType('equipment')}
              className={`flex-1 flex-row-reverse justify-center items-center py-4 rounded-2xl border-2 ${type === 'equipment' ? 'bg-teal-100 border-teal-500' : 'bg-white border-slate-200'}`}
            >
              <Package size={20} color={type === 'equipment' ? '#0d9488' : '#64748b'} />
              <Text className={`mr-2 font-bold ${type === 'equipment' ? 'text-teal-700' : 'text-slate-600'}`}>جهاز / معدات</Text>
            </Pressable>
            <Pressable
              onPress={() => setType('service')}
              className={`flex-1 flex-row-reverse justify-center items-center py-4 rounded-2xl border-2 ${type === 'service' ? 'bg-teal-100 border-teal-500' : 'bg-white border-slate-200'}`}
            >
              <Clock size={20} color={type === 'service' ? '#0d9488' : '#64748b'} />
              <Text className={`mr-2 font-bold ${type === 'service' ? 'text-teal-700' : 'text-slate-600'}`}>خدمة مخبرية</Text>
            </Pressable>
          </View>
        </View>

        {/* Name */}
        <View className="mb-6">
          <Text className={labelClassName}>
            {type === 'equipment' ? 'اسم الجهاز' : 'اسم الخدمة'} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={type === 'equipment' ? 'مثال: مجهر إلكتروني متطور' : 'مثال: تحليل مياه الشرب'}
            className={inputClassName}
            textAlign="right"
          />
        </View>

        {/* Image Picker */}
        <View className="mb-6">
          <View className="mb-3 flex-row-reverse items-center justify-between">
            <View className="flex-row-reverse items-center gap-2">
              <ImageIcon size={18} color="#475569" />
              <Text className="text-sm font-semibold text-slate-700">صور الجهاز ({images.length + existingImages.length}/3)</Text>
            </View>
            {(images.length + existingImages.length) < 3 && (
              <Pressable onPress={pickImages} className="rounded-xl bg-teal-50 px-3 py-1">
                <Text className="text-xs font-bold text-teal-600">التقاط صورة</Text>
              </Pressable>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse">
            {/* Add More Button (Inline) */}
            {(images.length + existingImages.length) > 0 && (images.length + existingImages.length) < 3 && (
              <Pressable
                onPress={pickImages}
                className="h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 ml-3"
              >
                <Plus size={24} color="#64748b" />
              </Pressable>
            )}

            {/* Existing Images */}
            {existingImages.map((uri, idx) => (
              <View key={`existing-${idx}`} className="ml-3 h-24 w-24 overflow-hidden rounded-2xl bg-slate-200">
                <Image source={{ uri }} className="h-full w-full" />
                <Pressable
                  onPress={() => removeExistingImage(idx)}
                  className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-sm"
                >
                  <X size={14} color="white" />
                </Pressable>
              </View>
            ))}

            {/* New Images */}
            {images.map((img, idx) => (
              <View key={`new-${idx}`} className="ml-3 h-24 w-24 overflow-hidden rounded-2xl bg-slate-200">
                <Image source={{ uri: img.uri }} className="h-full w-full" />
                <Pressable
                  onPress={() => removeImage(idx)}
                  className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-sm"
                >
                  <X size={14} color="white" />
                </Pressable>
              </View>
            ))}

            {images.length === 0 && existingImages.length === 0 && (
              <Pressable
                onPress={pickImages}
                className="h-24 w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50"
              >
                <Text className="text-sm text-slate-400">لم يتم التقاط أي صور</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        {/* Description */}
        <View className="mb-6">
          <View className="mb-2 flex-row-reverse items-center gap-2">
            <FileText size={18} color="#475569" />
            <Text className="text-sm font-semibold text-slate-700">الوصف <Text className="text-red-500">*</Text></Text>
          </View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="اكتب وصفاً تفصيلياً للجهاز..."
            multiline
            numberOfLines={4}
            className={`${inputClassName} h-32`}
            textAlignVertical="top"
            textAlign="right"
          />
        </View>

        {/* Availability Status */}
        <View className="mb-6">
          <View className="mb-3 flex-row-reverse items-center gap-2">
            <Clock size={18} color="#475569" />
            <Text className="w-full text-sm text-right font-semibold text-slate-700">حالة التوفر</Text>
          </View>
          <View className="flex-row-reverse gap-3">
            <Pressable
              onPress={() => setIsAvailable(true)}
              className={`flex-1 py-4 rounded-2xl border-2 items-center ${isAvailable
                ? 'bg-green-100 border-green-500'
                : 'bg-white border-slate-200'
                }`}
            >
              <Text className={`font-bold ${isAvailable ? 'text-green-700' : 'text-slate-600'}`}>متاح الآن</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsAvailable(false)}
              className={`flex-1 py-4 rounded-2xl border-2 items-center ${!isAvailable
                ? 'bg-orange-100 border-orange-500'
                : 'bg-white border-slate-200'
                }`}
            >
              <Text className={`font-bold ${!isAvailable ? 'text-orange-700' : 'text-slate-600'}`}>محجوز</Text>
            </Pressable>
          </View>
        </View>

        {/* Location */}
        <View className="mb-6">
          <View className="mb-2 flex-row-reverse items-center gap-2">
            <MapPin size={18} color="#475569" />
            <Text className="text-sm font-semibold text-slate-700">الموقع <Text className="text-red-500">*</Text></Text>
          </View>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="مثال: الطابق الثاني - قاعة B12"
            className={inputClassName}
            textAlign="right"
          />
        </View>

        {/* Supervisor */}
        <View className="mb-6">
          <View className="mb-2 flex-row-reverse items-center gap-2">
            <User size={18} color="#475569" />
            <Text className="text-sm font-semibold text-slate-700">المشرف <Text className="text-red-500">*</Text></Text>
          </View>
          <TextInput
            value={supervisor}
            onChangeText={setSupervisor}
            placeholder="مثال: د. خالد العربي"
            className={inputClassName}
            textAlign="right"
          />
        </View>

        {/* Specifications */}
        <View className="mb-6">
          <View className="flex-row-reverse items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-slate-700">المواصفات التقنية</Text>
            <Pressable
              onPress={handleAddSpecification}
              className="flex-row-reverse items-center gap-1"
            >
              <Plus size={16} color="#0d9488" />
              <Text className="text-sm font-bold text-teal-600">إضافة مواصفة</Text>
            </Pressable>
          </View>
          <View className="gap-3">
            {specifications.map((spec, index) => (
              <View key={index} className="flex-row items-center gap-2">
                {specifications.length > 1 && (
                  <Pressable
                    onPress={() => handleRemoveSpecification(index)}
                    className="p-2 rounded-xl bg-red-50"
                  >
                    <X size={20} color="#dc2626" />
                  </Pressable>
                )}
                <TextInput
                  value={spec.value}
                  onChangeText={(val) => handleSpecificationChange(index, 'value', val)}
                  placeholder="القيمة"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-right text-sm"
                />
                <TextInput
                  value={spec.label}
                  onChangeText={(val) => handleSpecificationChange(index, 'label', val)}
                  placeholder="الاسم"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-right text-sm"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl"
        style={{ paddingBottom: Platform.OS === 'ios' ? 34 : 20 }}
      >
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-1 bg-slate-100 py-2 rounded-2xl items-center"
          >
            <Text className="text-lg font-bold text-slate-700">إلغاء</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={loading}
            className={`flex-1 py-2 rounded-2xl flex-row-reverse justify-center gap-3 shadow-lg ${loading ? 'opacity-70' : ''}`}
            style={{ backgroundColor: '#0d9488' }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Check size={24} color="white" strokeWidth={3} />
                <Text className="text-md font-bold text-white">حفظ الجهاز</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
