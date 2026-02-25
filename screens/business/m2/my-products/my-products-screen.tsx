import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput } from "react-native";

const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Chemicals', active: false },
  { id: '3', name: 'Glassware', active: false },
  { id: '4', name: 'Labs', active: false },
];

const MY_PRODUCTS = [
  { id: '1', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '2', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '3', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '4', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '5', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
];

export default function MyProductsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 40,
      }}>

        {/* Header */}
        <View style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#111',
          }}>New Product</Text>
          <TouchableOpacity style={{
            width: 36,
            height: 36,
            backgroundColor: '#E7F2FD',
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 24,
              color: '#137FEC',
              fontWeight: '500',
              marginTop: -2,
            }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filters Section */}
        <View style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 12,
          gap: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}>
          {/* Search Bar */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F6F7F8',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            gap: 10,
          }}>
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#616A7B',
            }} />
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                color: '#111',
              }}
              placeholder="Search chemicals, glassware"
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity style={{ padding: 4 }}>
              <View style={{
                width: 18,
                height: 14,
                justifyContent: 'space-between',
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderColor: '#137FEC',
              }} />
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 100,
                  backgroundColor: cat.active ? '#137FEC' : '#F6F7F8',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: cat.active ? '#FFF' : '#5D6575',
                }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <View style={{ gap: 12 }}>
          {MY_PRODUCTS.map((product) => (
            <View key={product.id} style={{
              flexDirection: 'row',
              backgroundColor: '#FFF',
              borderRadius: 16,
              padding: 12,
              gap: 12,
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}>
              <View style={{
                width: 80,
                height: 80,
                backgroundColor: '#D9D9D9',
                borderRadius: 12,
              }} />

              <View style={{
                flex: 1,
                gap: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#111',
                }} numberOfLines={2}>
                  {product.name}
                </Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 8,
                }}>
                  <Text style={{
                    fontSize: 11,
                    color: '#5D6575',
                    fontWeight: '600',
                  }}>SKU: {product.sku}</Text>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#111',
                  }}>{product.price}</Text>
                </View>

                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#27AE60',
                }}>{product.stock}</Text>
              </View>

              <TouchableOpacity style={{
                width: 36,
                height: 36,
                backgroundColor: '#F0F2F5',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {/* Pencil Icon Placeholder */}
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View style={{ width: 12, height: 4, backgroundColor: '#137FEC', borderRadius: 1, transform: [{ rotate: '-45deg' }] }} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}