import React from "react";
import { View, TextInput, ViewStyle } from "react-native";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import SearchIcon from "@/assets/icons/search-icon";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = "Search for equipment or labs...",
  onSubmitEditing,
  onClear,
  style
}) => {
  const isSearching = value.length > 0;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText("");
    }
  };

  return (
    <View
      style={[{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 4,
      }, style]}
    >
      <SearchIcon color="#137FEC" />
      <TextInput
        style={{ flex: 1, color: '#111', fontSize: 15, fontWeight: '500' }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isSearching && (
        <TouchableOpacity onPress={handleClear} activeOpacity={1}>
          <Text style={{ color: '#9CA3AF', fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};