import React from 'react';
import ActionSheet, { SheetProps, SheetManager } from "react-native-actions-sheet";
import { View } from 'react-native';
import Text from '../components/text';
import TouchableOpacity from '../components/touchable-opacity';

export interface ImagePickerOption {
  id: 'camera' | 'gallery';
  label: string;
  icon: string;
}

export default function ImagePickerSheet(props: SheetProps<'image-picker-sheet'>) {
  const { onSelect } = props.payload || {};

  const options: ImagePickerOption[] = [
    { id: 'camera', label: 'Take Photo', icon: '📷' },
    { id: 'gallery', label: 'Choose from Gallery', icon: '🖼️' },
  ];

  return (
    <ActionSheet id={props.sheetId} containerStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: '#FFF' }}>
      <View style={{ padding: 24, paddingBottom: 40, paddingTop: 12 }}>
        {/* Handle bar */}
        <View style={{ width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

        <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 16 }}>Select Image</Text>

        <View style={{ gap: 12 }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={{
                padding: 18,
                borderRadius: 16,
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#F1F5F9',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16
              }}
              onPress={async () => {
                // await SheetManager.hide(props.sheetId);
                onSelect?.(option.id);
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>{option.icon}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ActionSheet>
  );
}
