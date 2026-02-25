import { View } from "react-native";
import TouchableOpacity from "../touchable-opacity";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ArrowIcon from "@/assets/icons/arrow-icon";
import Text from "../text";

export const TopHeader1 = ({ rightLabel = null }: { rightLabel?: string | null }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingLeft: 10, }}>
      <TouchableOpacity
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        onPress={() => navigation.goBack()}
        style={{ paddingRight: 24 }}
      >
        <ArrowIcon size={30} />
      </TouchableOpacity>
      {rightLabel
        &&
        <View>
          <Text style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{rightLabel}</Text>
        </View>
      }

    </View>
  );
};