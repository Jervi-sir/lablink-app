import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions } from "react-native";

export default function EditLabProfileScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
      }}>
        <TouchableOpacity style={{ width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#111', transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Edit Lab Profile</Text>
        <TouchableOpacity style={{ width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>

        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <View style={{ width: 160, height: 160, backgroundColor: '#D9D9D9', borderRadius: 80, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <TouchableOpacity style={{ width: 44, height: 44, backgroundColor: '#137FEC', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF', marginRight: 4, marginBottom: 4 }}>
              {/* Camera Icon Placeholder */}
              <View style={{ width: 20, height: 16, borderWidth: 2, borderColor: '#FFF', borderRadius: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Public Profile Button */}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7F2FD', height: 48, borderRadius: 12, gap: 10, marginBottom: 8 }}>
          <View style={{ width: 18, height: 12, borderWidth: 2, borderColor: '#137FEC', borderRadius: 6 }} />
          <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '600' }}>Preview Public Profile</Text>
        </TouchableOpacity>

        {/* Lab Identity Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 }}>Lab Identity</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Lab Name</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Description/ Bio</Text>
            <View style={[{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }, { height: 120, paddingVertical: 12, justifyContent: 'flex-start' }]}>
              <TextInput
                style={[{ fontSize: 14, color: '#111', height: '100%' }, { textAlignVertical: 'top' }]}
                placeholder="Placeholder"
                placeholderTextColor="#A0AEC0"
                multiline
              />
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 }}>Contact Information</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Email</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" keyboardType="email-address" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Phone Number</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" keyboardType="phone-pad" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Website</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Business Address Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 }}>Business Address</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Street Address</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>City</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>Wilaya</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput style={{ fontSize: 14, color: '#111', height: '100%' }} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Certification Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 }}>Certification</Text>

          {/* Existing Certification Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#F0F2F5', borderRadius: 12, gap: 12 }}>
            <View style={{ width: 44, height: 44, backgroundColor: '#FFF3F3', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 16, height: 20, backgroundColor: '#FF4D4D', borderRadius: 2 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>pdf.file</Text>
              <Text style={{ fontSize: 12, color: '#5D6575', marginTop: 2 }}>2.4 MB - Uploaded Oct 12</Text>
            </View>
            <TouchableOpacity style={{ padding: 8 }}>
              <View style={{ width: 18, height: 20, backgroundColor: '#111', borderRadius: 2 }} />
            </TouchableOpacity>
          </View>

          {/* Upload Box */}
          <TouchableOpacity style={{ height: 160, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#E7F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 14, height: 18, borderWidth: 2, borderColor: '#137FEC', borderRadius: 2 }} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>Upload Certification</Text>
            <Text style={{ fontSize: 12, color: '#A0AEC0' }}>PDF, JPG, PNG up to 10MB</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

