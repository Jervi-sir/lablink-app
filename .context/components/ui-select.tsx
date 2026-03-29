import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { uiTokens } from './tokens';

export interface UISelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface UISelectProps<T = string> {
  label?: string;
  placeholder?: string;
  value?: T;
  options: Array<UISelectOption<T>>;
  onChange: (value: T, option: UISelectOption<T>) => void;
  disabled?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const UISelect = <T,>({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  disabled = false,
  helperText,
  containerStyle,
}: UISelectProps<T>) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => Object.is(option.value, value)),
    [options, value]
  );

  const handleSelect = (option: UISelectOption<T>) => {
    onChange(option.value, option);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          disabled && styles.disabled,
          pressed && !disabled && styles.triggerPressed,
          containerStyle,
        ]}
      >
        <View style={styles.triggerTextWrap}>
          <Text style={[styles.triggerText, !selectedOption && styles.placeholder]} numberOfLines={1}>
            {selectedOption?.label || placeholder}
          </Text>
          {selectedOption?.description ? (
            <Text style={styles.selectedDescription} numberOfLines={1}>
              {selectedOption.description}
            </Text>
          ) : null}
        </View>
        <Text style={styles.chevron}>v</Text>
      </Pressable>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

      <Modal animationType="fade" transparent visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>{label || 'Select'}</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionList}>
              {options.map((option, index) => {
                const active = Object.is(option.value, value);

                return (
                  <Pressable
                    key={`${String(option.label)}-${index}`}
                    onPress={() => handleSelect(option)}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text style={styles.optionDescription}>{option.description}</Text>
                      ) : null}
                    </View>
                    {active ? <Text style={styles.checkmark}>Selected</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: uiTokens.spacing.xs,
  },
  label: {
    color: uiTokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  trigger: {
    minHeight: 52,
    borderRadius: uiTokens.radius.md,
    paddingHorizontal: uiTokens.spacing.md,
    borderWidth: 1,
    borderColor: uiTokens.colors.border,
    backgroundColor: uiTokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTokens.spacing.md,
  },
  triggerPressed: {
    backgroundColor: uiTokens.colors.surfaceMuted,
  },
  triggerTextWrap: {
    flex: 1,
    gap: 2,
  },
  triggerText: {
    color: uiTokens.colors.text,
    fontSize: 15,
  },
  placeholder: {
    color: '#98A2B3',
  },
  selectedDescription: {
    color: uiTokens.colors.textMuted,
    fontSize: 12,
  },
  chevron: {
    color: uiTokens.colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    color: uiTokens.colors.textMuted,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: uiTokens.colors.overlay,
    justifyContent: 'flex-end',
    padding: uiTokens.spacing.lg,
  },
  sheet: {
    maxHeight: '70%',
    borderRadius: uiTokens.radius.xl,
    backgroundColor: uiTokens.colors.surface,
    padding: uiTokens.spacing.lg,
    gap: uiTokens.spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: uiTokens.colors.text,
  },
  optionList: {
    gap: uiTokens.spacing.sm,
  },
  option: {
    borderRadius: uiTokens.radius.md,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: uiTokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTokens.spacing.md,
  },
  optionActive: {
    borderColor: '#84CAFF',
    backgroundColor: uiTokens.colors.primarySoft,
  },
  optionTextWrap: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    color: uiTokens.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: uiTokens.colors.primary,
  },
  optionDescription: {
    color: uiTokens.colors.textMuted,
    fontSize: 12,
  },
  checkmark: {
    color: uiTokens.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default UISelect;
