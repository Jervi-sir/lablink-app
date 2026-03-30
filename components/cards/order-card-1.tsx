import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Image } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  item: { en: 'item', fr: 'article', ar: 'عنصر' },
  items: { en: 'items', fr: 'articles', ar: 'عناصر' },
  view_details: { en: 'View Details', fr: 'Voir les détails', ar: 'عرض التفاصيل' },
  track_order: { en: 'Track Order', fr: 'Suivre la commande', ar: 'تتبع الطلب' },
};

export const OrderCard1 = ({ item, onPress }: { item: any, onPress: () => void }) => {
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <TouchableOpacity
      style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{item.id}</Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{item.date}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, backgroundColor: item.statusColor + '15' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.statusColor }} />
          <Text style={{ fontSize: 11, fontWeight: '800', textTransform: 'uppercase', color: item.statusColor }}>{item.status}</Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 12 }} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.productImages?.map((url: string, index: number) => (
            <View
              key={index}
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                backgroundColor: '#F1F5F9',
                borderWidth: 2,
                borderColor: '#FFF',
                marginLeft: index === 0 ? 0 : -35, // Premium stacking effect
                zIndex: 10 - index,
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
            >
              <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
          ))}
          {item.totalProducts > 3 && (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#F8FAFC',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B' }}>+{item.totalProducts - 3}</Text>
            </View>
          )}
          {(!item.productImages || item.productImages.length === 0) && (
            <View style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{item.lab} • {item.totalProducts} {item.totalProducts === 1 ? t('item') : t('items')}</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }} numberOfLines={1}>{item.product}</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#111', marginTop: 2 }}>{item.price}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
        <TouchableOpacity
          style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={onPress}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>{t('view_details')}</Text>
        </TouchableOpacity>
        {item.status === 'In Progress' && (
          <TouchableOpacity style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }} onPress={onPress}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>{t('track_order')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};