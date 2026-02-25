import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, PanResponder } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { Button1 } from "@/components/buttons/button-1";

// Constants for slider
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 100000;

// Icons
const BellIcon = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
      fill={color}
    />
  </Svg>
);

const InstitutionIcon = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
      fill={color}
    />
    <Path
      d="M5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z"
      fill={color}
    />
  </Svg>
);

const BuildingIcon = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
      fill={color}
    />
  </Svg>
);

const CheckIcon = ({ size = 16, color = "#FFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
      fill={color}
    />
  </Svg>
);

interface RangeSliderProps {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
  onValuesChange: (min: number, max: number) => void;
}

const RangeSlider = ({ min, max, minPrice, maxPrice, onValuesChange }: RangeSliderProps) => {
  const [width, setWidth] = useState(0);

  const getPositionFromValue = (value: number) => {
    if (width === 0) return 0;
    return ((value - min) / (max - min)) * width;
  };

  const getValueFromPosition = (position: number) => {
    const val = (position / width) * (max - min) + min;
    return Math.max(min, Math.min(max, Math.round(val / 100) * 100));
  };

  const initialMinPrice = useRef(0);
  const initialMaxPrice = useRef(0);
  const minPriceRef = useRef(minPrice);
  const maxPriceRef = useRef(maxPrice);

  useEffect(() => {
    minPriceRef.current = minPrice;
    maxPriceRef.current = maxPrice;
  }, [minPrice, maxPrice]);

  const leftThumbPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialMinPrice.current = minPriceRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const newPos = getPositionFromValue(initialMinPrice.current) + gestureState.dx;
        const newVal = getValueFromPosition(newPos);
        if (newVal < maxPriceRef.current) {
          onValuesChange(newVal, maxPriceRef.current);
        }
      },
    })
  ).current;

  const rightThumbPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialMaxPrice.current = maxPriceRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const newPos = getPositionFromValue(initialMaxPrice.current) + gestureState.dx;
        const newVal = getValueFromPosition(newPos);
        if (newVal > minPriceRef.current) {
          onValuesChange(minPriceRef.current, newVal);
        }
      },
    })
  ).current;

  const leftPos = getPositionFromValue(minPrice);
  const rightPos = getPositionFromValue(maxPrice);

  return (
    <View
      style={{ height: 40, justifyContent: 'center', marginBottom: 8 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={{ height: 4, backgroundColor: '#E1E4E8', borderRadius: 2, position: 'relative' }}>
        <View
          style={[
            { position: 'absolute', height: 4, backgroundColor: '#137FEC' },
            { left: leftPos, width: rightPos - leftPos }
          ]}
        />
        <View
          {...leftThumbPanResponder.panHandlers}
          style={[{ position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#137FEC', top: -8, marginLeft: -10 }, { left: leftPos }]}
        />
        <View
          {...rightThumbPanResponder.panHandlers}
          style={[{ position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#137FEC', top: -8, marginLeft: -10 }, { left: rightPos }]}
        />
      </View>
    </View>
  );
};

export default function FilterScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Chemicals");
  const [labType, setLabType] = useState<"university" | "commercial">("university");
  const [safetyLevels, setSafetyLevels] = useState<string[]>(["Non-Hazardous"]);
  const [minPrice, setMinPrice] = useState(1500);
  const [maxPrice, setMaxPrice] = useState(15000);

  const categories = ["Chemicals", "Equipment", "Kits", "Glass"];
  const safetyOptions = ["Non-Hazardous", "Hazardous", "Contagious", "Glass"];

  const toggleSafetyLevel = (level: string) => {
    if (safetyLevels.includes(level)) {
      setSafetyLevels(safetyLevels.filter(l => l !== level));
    } else {
      setSafetyLevels([...safetyLevels, level]);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F7F9FC' }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1E4E8' }} />
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Username</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Email</Text>
          </View>
        </View>
        <TouchableOpacity style={{ padding: 4 }}>
          <BellIcon size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Category Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 }}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F0F2F5', borderWidth: 1, borderColor: '#E1E4E8', marginRight: 8 },
                  selectedCategory === cat && { backgroundColor: '#E7F2FD', borderColor: '#137FEC' }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  { fontSize: 13, fontWeight: '500', color: '#4B5563' },
                  selectedCategory === cat && { color: '#137FEC' }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price Range Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 }}>Price Range</Text>
          <RangeSlider
            min={MIN_PRICE_LIMIT}
            max={MAX_PRICE_LIMIT}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onValuesChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12, height: 44 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginRight: 4 }}>DA</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#111' }}
                value={minPrice.toString()}
                onChangeText={(val) => {
                  const num = Math.max(MIN_PRICE_LIMIT, Math.min(MAX_PRICE_LIMIT, parseInt(val) || 0));
                  setMinPrice(Math.min(num, maxPrice));
                }}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12, height: 44 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginRight: 4 }}>DA</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#111' }}
                value={maxPrice.toString()}
                onChangeText={(val) => {
                  const num = Math.max(MIN_PRICE_LIMIT, Math.min(MAX_PRICE_LIMIT, parseInt(val) || 0));
                  setMaxPrice(Math.max(num, minPrice));
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>


        {/* Lab Type Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 }}>Lab Type</Text>
          <TouchableOpacity
            style={[
              { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 12, padding: 16, marginBottom: 12 },
              labType === 'university' && { borderColor: '#137FEC', backgroundColor: '#F8FBFF' }
            ]}
            onPress={() => setLabType('university')}
          >
            <View style={[
              { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
              labType === 'university' && { backgroundColor: '#137FEC', borderColor: '#137FEC' }
            ]}>
              {labType === 'university' && <CheckIcon size={12} />}
            </View>
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <InstitutionIcon size={24} color="#111" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>University Lab</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Verified academic institutions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 12, padding: 16, marginBottom: 12 },
              labType === 'commercial' && { borderColor: '#137FEC', backgroundColor: '#F8FBFF' }
            ]}
            onPress={() => setLabType('commercial')}
          >
            <View style={[
              { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
              labType === 'commercial' && { backgroundColor: '#137FEC', borderColor: '#137FEC' }
            ]}>
              {labType === 'commercial' && <CheckIcon size={12} />}
            </View>
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <BuildingIcon size={24} color="#111" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Commercial Lab</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Private research facilities</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Safety Level Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 }}>Safety Level</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {safetyOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F0F2F5', borderWidth: 1, borderColor: '#E1E4E8', marginRight: 8, marginBottom: 8 },
                  safetyLevels.includes(opt) && { backgroundColor: '#E7F2FD', borderColor: '#137FEC' }
                ]}
                onPress={() => toggleSafetyLevel(opt)}
              >
                <Text style={[
                  { fontSize: 13, fontWeight: '500', color: '#4B5563' },
                  safetyLevels.includes(opt) && { color: '#137FEC' }
                ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', gap: 12 }}>
        <TouchableOpacity
          style={{ paddingHorizontal: 12, paddingVertical: 12 }}
          onPress={() => {
            setSelectedCategory("");
            setLabType("university");
            setSafetyLevels([]);
            setMinPrice(MIN_PRICE_LIMIT);
            setMaxPrice(MAX_PRICE_LIMIT);
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#6B7280' }}>Clear All</Text>
        </TouchableOpacity>
        <Button1
          text="Apply Filters"
          style={{ flex: 1, height: 48 }}
          textStyle={{ fontSize: 15, fontWeight: '700' }}
          onPress={() => console.log('Filters applied')}
        />
      </View>
    </ScreenWrapper>
  );
}