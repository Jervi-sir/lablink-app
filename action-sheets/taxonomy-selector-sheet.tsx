import React from 'react';
import ActionSheet, { SheetProps, SheetManager, ScrollView } from "react-native-actions-sheet";
import { View } from 'react-native';
import Text from '../components/text';
import TouchableOpacity from '../components/touchable-opacity';

export interface TaxonomyItem {
  id: number;
  code: string;
  number?: string | number;
}

export default function TaxonomySelectorSheet(props: SheetProps<'taxonomy-selector-sheet'>) {
  const { title = "Select Option", items, onSelect, selectedId } = props.payload || {};

  return (
    <ActionSheet id={props.sheetId} containerStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: '#FFF' }}>
      <View style={{ padding: 24, paddingBottom: 40, paddingTop: 12 }}>
        {/* Handle bar */}
        <View style={{ width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

        <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 16 }}>{title}</Text>

        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 8 }}>
            {items?.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: isSelected ? '#F5F3FF' : '#F8FAFC',
                    borderWidth: 1,
                    borderColor: isSelected ? '#8B5CF6' : '#F1F5F9',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onPress={() => {
                    onSelect?.(item);
                    SheetManager.hide(props.sheetId);
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: isSelected ? '700' : '600', color: isSelected ? '#7C3AED' : '#334155' }}>
                    {item.number ? `${item.number} - ${item.code}` : item.code}
                  </Text>
                  {isSelected && (
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: 10, height: 5, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#FFF', transform: [{ rotate: '-45deg' }], marginTop: -2 }} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
