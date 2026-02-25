import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput } from "react-native";

export default function EditProductScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#111',
        }}>New Product</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 40,
      }}>

        {/* Basic Information - Section 1 */}
        <View style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 16,
          gap: 16,
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
          }}>Basic Information</Text>

          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#111',
            }}>Product Name</Text>
            <View style={{
              height: 48,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              borderRadius: 12,
              backgroundColor: '#FFF',
              paddingHorizontal: 12,
              justifyContent: 'center',
            }}>
              <TextInput style={{
                fontSize: 14,
                color: '#111',
                height: '100%',
              }} placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#111',
            }}>Category</Text>
            <View style={{
              height: 48,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              borderRadius: 12,
              backgroundColor: '#FFF',
              paddingHorizontal: 12,
              justifyContent: 'center',
            }}>
              <TextInput style={{
                fontSize: 14,
                color: '#111',
                height: '100%',
              }} placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Basic Information - Section 2 */}
        <View style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 16,
          gap: 16,
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
          }}>Basic Information</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#111',
              }}>Price</Text>
              <View style={{
                height: 48,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                borderRadius: 12,
                backgroundColor: '#FFF',
                paddingHorizontal: 12,
                justifyContent: 'center',
              }}>
                <TextInput style={{
                  fontSize: 14,
                  color: '#111',
                  height: '100%',
                }} placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#111',
              }}>Stock Qty</Text>
              <View style={{
                height: 48,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                borderRadius: 12,
                backgroundColor: '#FFF',
                paddingHorizontal: 12,
                justifyContent: 'center',
              }}>
                <TextInput style={{
                  fontSize: 14,
                  color: '#111',
                  height: '100%',
                }} placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
          </View>
        </View>

        {/* Media & Documentation */}
        <View style={{
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 16,
          gap: 16,
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
          }}>Media & Documentation</Text>

          {/* Upload Photos Box */}
          <TouchableOpacity style={{
            height: 160,
            borderWidth: 1.5,
            borderColor: '#E2E8F0',
            borderStyle: 'dashed',
            borderRadius: 12,
            backgroundColor: '#F8F9FB',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#111',
            }}>Upload Photos</Text>
            <Text style={{
              fontSize: 12,
              color: '#A0AEC0',
            }}>JPEG or PNG, max 5MB</Text>
          </TouchableOpacity>

          {/* PDF Attachment Row */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderColor: '#F0F2F5',
            borderRadius: 12,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: '#FFF3F3',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{ width: 14, height: 18, backgroundColor: '#FF4D4D', borderRadius: 2 }} />
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111' }}>Document PDF</Text>
                <Text style={{ fontSize: 11, color: '#5D6575' }}>Document name</Text>
              </View>
            </View>
            <TouchableOpacity style={{
              backgroundColor: '#E0E0E0',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#111',
              }}>Attach PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={{
          backgroundColor: '#137FEC',
          height: 54,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 8,
        }}>
          <Text style={{
            color: '#FFF',
            fontSize: 16,
            fontWeight: '700',
          }}>Publish Product</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}