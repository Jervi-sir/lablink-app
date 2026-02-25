import React from "react";
import { View, LayoutAnimation, Platform, UIManager } from "react-native";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onPress: () => void;
}

export const OptionSettings2: React.FC<FAQItemProps> = ({ question, answer, isExpanded, onPress }) => {
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9'
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: '#1E293B', paddingRight: 12 }}>
          {question}
        </Text>
        <View style={[
          {
            width: 8,
            height: 8,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: '#CBD5E1',
            transform: [{ rotate: '45deg' }]
          },
          isExpanded && { transform: [{ rotate: '-135deg' }], marginTop: 4 }
        ]} />
      </View>
      {isExpanded && (
        <Text style={{
          fontSize: 14,
          color: '#64748B',
          lineHeight: 22,
          marginTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F8FAFC',
          paddingTop: 12
        }}>
          {answer}
        </Text>
      )}
    </TouchableOpacity>
  );
};
